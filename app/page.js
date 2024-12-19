"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveOrder } from '@/utils/localStorage'
import { shoes, Shoe } from '@/utils/shoeData'

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()

  const [order, setOrder] = useState({
    customerName: '',
    productId: '',
    quantity: 1,
  })
  const [selectedShoe, setSelectedShoe] = useState  (null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedShoe) {
      // toast.error('Please select a shoe')

      toast({
        title: 'Please select a shoe',
        variant: 'destructive',
      })

      return
    }
    const newOrder = {
      id: Date.now().toString(),
      customerName: order.customerName,
      product: selectedShoe.name,
      quantity: order.quantity,
      totalPrice: selectedShoe.price * order.quantity,
    }
    saveOrder(newOrder)
    setOrder({ customerName: '', productId: '', quantity: 1 })
    setSelectedShoe(null)
    router.refresh()
    // toast.success('Order created successfully!')
    toast({
      title: 'Order created successfully!',
      variant: 'success',
    })

  }

  const handleShoeSelect = (shoeId) => {
    const shoe = shoes.find(s => s.id === shoeId)
    setSelectedShoe(shoe || null)
    setOrder(prev => ({ ...prev, productId: shoeId }))
  }

  return (
    <div className="min-h-screen py-8 bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-violet-700">Shoe Store</h1>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="bg-gray-800">
            <CardTitle className="text-2xl text-blue-200">Create New Order</CardTitle>
            <CardDescription className="text-gray-400">Select a shoe and fill in the details to create a new order.</CardDescription>
          </CardHeader>
          <CardContent className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-lg text-gray-300">Customer Name</Label>
                <Input
                  id="customerName"
                  value={order.customerName}
                  onChange={(e) => setOrder({ ...order, customerName: e.target.value })}
                  required
                  placeholder="Enter customer's full name"
                  className="w-full bg-gray-800 text-white border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product" className="text-lg text-gray-300">Select Shoe</Label>
                <Select onValueChange={handleShoeSelect} value={order.productId}>
                  <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                    <SelectValue placeholder="Select a shoe" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    {shoes.map((shoe) => (
                      <SelectItem key={shoe.id} value={shoe.id} className="focus:bg-gray-700">
                        {shoe.name} - ${shoe.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedShoe && (
                <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg">
                  <Image
                    src={selectedShoe.image}
                    alt={selectedShoe.name}
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-blue-300">{selectedShoe.name}</h3>
                    <p className="text-gray-400">${selectedShoe.price.toFixed(2)}</p>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-lg text-gray-300">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={order.quantity}
                  onChange={(e) => setOrder({ ...order, quantity: parseInt(e.target.value) })}
                  required
                  min="1"
                  placeholder="Enter quantity"
                  className="w-full bg-gray-800 text-white border-gray-700"
                />
              </div>
              {selectedShoe && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <Label className="text-lg text-gray-300">Total Price</Label>
                  <p className="text-2xl font-bold text-blue-300">Rs. {(selectedShoe.price * order.quantity).toFixed(2)}</p>
                </div>
              )}
              <Button type="submit" className="w-full bg-blue-700 text-white hover:bg-blue-600">Create Order</Button>
            </form>
          </CardContent>
          <CardFooter className="bg-gray-900">
            <p className="text-sm text-gray-400">
              All fields are required. Make sure to double-check the information before submitting.
            </p>
          </CardFooter>
        </Card>
        <div className="mt-6 text-center">
          <Link href="/admin">
            <Button variant="outline" className="bg-gray-800 text-white hover:bg-gray-700 border-gray-700">Go to Admin Page</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

