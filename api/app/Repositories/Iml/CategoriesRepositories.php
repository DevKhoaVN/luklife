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
        // --- ĐOẠN CODE MỚI THÊM ---
        // Kiểm tra: Nếu trường 'image' tồn tại VÀ nó là một File hợp lệ
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {

            // Gọi hàm phụ trợ ở trên, đổi Object File thành đường dẫn String
            // Ví dụ: $data['image'] giờ thành "categories/anh-dep.jpg"
            $data['image'] = $this->uploadFile($data['image']);
        }
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
        // --- LOGIC XỬ LÝ ẢNH ---

        // TRƯỜNG HỢP 1: Có gửi ảnh mới lên
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {

            // Bước 1: Dọn rác. Kiểm tra xem danh mục này ngày xưa có ảnh không?
            if ($category->image && Storage::exists('public/' . $category->image)) {
                // Nếu có -> Xóa cái ảnh cũ trong ổ cứng đi cho nhẹ máy
                Storage::delete('public/' . $category->image);
            }

            // Bước 2: Upload ảnh mới và lấy đường dẫn đè vào dữ liệu
            $data['image'] = $this->uploadFile($data['image']);
        }

        // TRƯỜNG HỢP 2: Không gửi ảnh (người dùng chỉ muốn sửa tên danh mục)
        else {
            // Ta phải loại bỏ key 'image' ra khỏi mảng $data.
            // Tại sao? Vì nếu không bỏ, Laravel có thể hiểu $data['image'] = null -> Nó xóa mất ảnh đang có trong DB.
            unset($data['image']);
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
        if ($category) {
            // Kiểm tra xem có ảnh không thì xóa đi
            if ($category->image && Storage::exists('public/' . $category->image)) {
                Storage::delete('public/' . $category->image);
            }
            return $category->delete(); // Sau đó mới xóa dữ liệu trong DB
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
        //Tạo tên file
        $fileName = time() . '_' . $file->getClientOriginalName();
        //Lưu file đó vào thư mục categories
        return $file->storeAs('categories', $fileName, 'public');
    }
}
