import { useEffect, useState } from 'react';
import { useProduct } from '@/hooks/useProduct';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateProduct() {
  const { updateProductHandler, fetchProductByIdHandler } = useProduct();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    image: '',
  });

  useEffect(() => {
    if (id) {
      fetchProductByIdHandler(id).then((data) => setForm(data));
    }
  }, [id, fetchProductByIdHandler]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProductHandler(id!, form);
    navigate('/admin/products');
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-2">Update Product</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <Input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <Input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <Input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          required
        />
        <Input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />
        <Input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          required
        />
        <Button type="submit">Update Product</Button>
      </form>
    </Card>
  );
}
