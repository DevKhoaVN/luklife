<?php

namespace App\Repositories\Iml;
use App\Models\Discount;
use App\Repositories\Contracts\DiscountRepositoriesInterface;

class DiscountRepositories implements DiscountRepositoriesInterface
{
    protected $model;

    public function __construct(Discount $model)
    {
        $this->model = $model;
    }
    public function all()
    {
        return $this->model->latest()->get();
    }

    public function paginate($perPage = 15)
    {
        return $this->model->latest()->paginate($perPage);
    }

    public function find($id)
    {
        return $this->model->findOrFail($id);
    }

    public function findByCode($code)
    {
        return $this->model->where('code', strtoupper($code))->first();
    }

    public function create(array $data)
    {
        $data['code'] = strtoupper($data['code']);
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $discount = $this->find($id);

        if (isset($data['code'])) {
            $data['code'] = strtoupper($data['code']);
        }

        $discount->update($data);
        return $discount->fresh();
    }

    public function delete($id)
    {
        $discount = $this->find($id);
        return $discount->delete();
    }

    public function getValid()
    {
        return $this->model->valid()->get();
    }

    public function search($keyword)
    {
        return $this->model->where('code', 'like', "%{$keyword}%")
            ->orWhere('name', 'like', "%{$keyword}%")
            ->latest()
            ->paginate(15);
    }
}