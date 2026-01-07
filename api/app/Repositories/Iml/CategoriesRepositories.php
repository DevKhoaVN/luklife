<?php

namespace App\Repositories\Iml;

use App\Models\categories as Category;
use App\Repositories\Contracts\CategoriesRepositoriesInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class CategoriesRepositories implements CategoriesRepositoriesInterface
{
    public function all(): Collection
    {
        return Category::all();
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Category::whereNull('parent_id')
            ->with(['children.children.children'])
            ->orderBy('id')
            ->paginate($perPage);
    }

    public function find(int $id): ?Category
    {
        return Category::find($id);
    }

    public function findBySlug(string $slug): ?Category
    {
        return Category::where('slug', $slug)->first();
    }

    public function create(array $data): Category
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $data['image'] = $this->uploadFile($data['image']);
        }
        if (isset($data['parent_id']) && $data['parent_id']) {
            $parent = $this->find($data['parent_id']);
            $data['level'] = $parent ? $parent->level + 1 : 0;
        } else {
            $data['parent_id'] = null;
            $data['level'] = 0;
        }

        return Category::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $category = $this->find($id);

        if (!$category) {
            return false;
        }
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            if ($category->image && Storage::exists('public/' . $category->image)) {
                Storage::delete('public/' . $category->image);
            }
            $data['image'] = $this->uploadFile($data['image']);
        } else {
            unset($data['image']);
        }
        if (isset($data['parent_id'])) {
            $parent = $data['parent_id'] ? $this->find($data['parent_id']) : null;
            $data['level'] = $parent ? $parent->level + 1 : 0;
        }

        return $category->update($data);
    }

    public function delete(int $id): bool
    {
        $category = $this->find($id);
        if ($category) {
            if ($category->image && Storage::exists('public/' . $category->image)) {
                Storage::delete('public/' . $category->image);
            }
            return $category->delete();
        }
        return false;
    }

    public function getActiveRootsWithChildren(): Collection
    {
        return Category::with('children')
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    private function uploadFile(UploadedFile $file)
    {
        $fileName = time() . '_' . $file->getClientOriginalName();
        return $file->storeAs('categories', $fileName, 'public');
    }
}
