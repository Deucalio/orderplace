"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getOrders,
  updateOrder,
  deleteOrder,
  Order,
} from "@/utils/localStorage";
import { shoes, Shoe } from "@/utils/shoeData";

export default function Admin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = (useState < Order) | (null > null);

  useEffect(() => {
    if (authenticated) {
      setOrders(getOrders());
    }
  }, [authenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "1234") {
      setAuthenticated(true);
      toast.success("Logged in successfully!");
    } else {
      toast.error("Incorrect password");
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
  };

  const handleUpdate = () => {
    if (editingOrder) {
      updateOrder(editingOrder);
      setOrders(getOrders());
      setEditingOrder(null);
      toast.success("Order updated successfully!");
    }
  };

  const handleDelete = (id) => {
    deleteOrder(id);
    setOrders(getOrders());
    toast.success("Order deleted successfully!");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Card className="w-[350px] bg-gray-900 border-gray-800">
          <CardHeader className="bg-gray-800">
            <CardTitle className="text-blue-200">Admin Login</CardTitle>
            <CardDescription className="text-gray-400">
              Enter the password to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-800 text-white border-gray-700"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-700 text-white hover:bg-blue-600"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-300">
          Admin Dashboard
        </h1>
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader className="bg-gray-800">
            <CardTitle className="text-blue-200">Order List</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your shoe orders here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">Customer Name</TableHead>
                  <TableHead className="text-gray-300">Product</TableHead>
                  <TableHead className="text-gray-300">Image</TableHead>
                  <TableHead className="text-gray-300">Quantity</TableHead>
                  <TableHead className="text-gray-300">Total Price</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="border-gray-800">
                    <TableCell className="text-gray-300">
                      {order.customerName}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {order.product}
                    </TableCell>
                    <TableCell>
                      <Image
                        src={
                          shoes.find((s) => s.name === order.product)?.image ||
                          "/placeholder.svg"
                        }
                        alt={order.product}
                        width={50}
                        height={50}
                        className="rounded-md"
                      />
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {order.quantity}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      ${order.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="mr-2 bg-gray-800 text-white hover:bg-gray-700 border-gray-700"
                        onClick={() => handleEdit(order)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(order.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {editingOrder && (
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader className="bg-gray-800">
              <CardTitle className="text-blue-200">Edit Order</CardTitle>
              <CardDescription className="text-gray-400">
                Update the order details below.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="editCustomerName"
                    className="text-lg text-gray-300"
                  >
                    Customer Name
                  </Label>
                  <Input
                    id="editCustomerName"
                    value={editingOrder.customerName}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        customerName: e.target.value,
                      })
                    }
                    className="w-full bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="editProduct"
                    className="text-lg text-gray-300"
                  >
                    Product
                  </Label>
                  <Select
                    value={editingOrder.product}
                    onValueChange={(value) => {
                      const selectedShoe = shoes.find((s) => s.name === value);
                      if (selectedShoe) {
                        setEditingOrder({
                          ...editingOrder,
                          product: value,
                          totalPrice:
                            selectedShoe.price * editingOrder.quantity,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="Select a shoe" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                      {shoes.map((shoe) => (
                        <SelectItem
                          key={shoe.id}
                          value={shoe.name}
                          className="focus:bg-gray-700"
                        >
                          {shoe.name} - ${shoe.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="editQuantity"
                    className="text-lg text-gray-300"
                  >
                    Quantity
                  </Label>
                  <Input
                    id="editQuantity"
                    type="number"
                    value={editingOrder.quantity}
                    onChange={(e) => {
                      const quantity = parseInt(e.target.value);
                      const selectedShoe = shoes.find(
                        (s) => s.name === editingOrder.product
                      );
                      if (selectedShoe) {
                        setEditingOrder({
                          ...editingOrder,
                          quantity,
                          totalPrice: selectedShoe.price * quantity,
                        });
                      }
                    }}
                    min="1"
                    className="w-full bg-gray-800 text-white border-gray-700"
                  />
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <Label className="text-lg text-gray-300">Total Price</Label>
                  <p className="text-2xl font-bold text-blue-300">
                    ${editingOrder.totalPrice.toFixed(2)}
                  </p>
                </div>
                <Button
                  onClick={handleUpdate}
                  className="w-full bg-blue-700 text-white hover:bg-blue-600"
                >
                  Update Order
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="text-center">
          <Link href="/">
            <Button
              variant="outline"
              className="bg-gray-800 text-white hover:bg-gray-700 border-gray-700"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
