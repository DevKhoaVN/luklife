<?php

namespace App\Repositories\Iml;

use App\Models\categories as Category;
use App\Repositories\Contracts\CategoriesRepositoriesInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CategoriesRepositories implements CategoriesRepositoriesInterface
{
    public function all(): Collection
    {
        return Category::all();
    }

    // app/Repositories/CategoryRepository.php

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Category::whereNull('parent_id') // chỉ lấy các category gốc (level 0)
            ->with(['children.children.children']) // load sâu 3 cấp con
            ->orderBy('id') // hoặc orderBy('name') tùy ý
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
        // Tự động tính level nếu có parent
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

        // Cập nhật level nếu thay đổi parent
        if (isset($data['parent_id'])) {
            $parent = $data['parent_id'] ? $this->find($data['parent_id']) : null;
            $data['level'] = $parent ? $parent->level + 1 : 0;
        }

        return $category->update($data);
    }

    public function delete(int $id): bool
    {
        $category = $this->find($id);
        return $category?->delete() ?? false;
    }

    public function getActiveRootsWithChildren(): Collection
    {
        return Category::with('children')
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }
}
