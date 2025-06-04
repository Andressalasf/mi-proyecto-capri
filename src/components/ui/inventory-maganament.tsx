"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit, Filter, Plus, Search, Trash2, ArrowDownUp } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Importar funciones de API
import { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  updateProductStock,
  getAllSuppliers,
  getAllStaff
} from "@/services/api"

// Importar interfaces
import { Product, CreateProductData, UpdateProductData } from "@/interfaces/product"
import { Supplier } from "@/interfaces/supplier"
import { Staff } from "@/interfaces/staff"

export function InventoryManagement() {
  const { toast } = useToast()
  
  // Estados para datos
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [employees, setEmployees] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estados para UI
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)
  const [activeFilters, setActiveFilters] = useState<{
    category: string[]
    supplier: string[]
  }>({
    category: [],
    supplier: [],
  })

  // Estados para diálogos
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [movementDialogOpen, setMovementDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)

  // Estados para formularios
  const [formData, setFormData] = useState<CreateProductData>({
    product_id: "",
    name: "",
    category: "Alimento",
    unit: "kg",
    quantity: 0,
    min_stock: 0,
    price: 0,
    location: "",
    expiry_date: "",
    supplier_id: undefined,
    description: ""
  })

  const [movementData, setMovementData] = useState({
    type: "",
    date: "",
    productId: "",
    quantity: 0,
    supplier_id: "",
    document: "",
    employee_id: ""
  })

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [productsData, suppliersData, employeesData] = await Promise.all([
        getAllProducts(),
        getAllSuppliers(),
        getAllStaff()
      ])
      
      // Validar y filtrar datos para asegurar que tengan IDs válidos
      const validProducts = (productsData || []).filter(product => 
        product && product.id && product.product_id && product.name
      ).map(product => ({
        ...product,
        price: typeof product.price === 'number' ? product.price : parseFloat(product.price || '0'),
        quantity: typeof product.quantity === 'number' ? product.quantity : parseFloat(product.quantity || '0'),
        min_stock: typeof product.min_stock === 'number' ? product.min_stock : parseFloat(product.min_stock || '0')
      }))
      
      const validSuppliers = (suppliersData || []).filter(supplier => 
        supplier && supplier.id && supplier.name
      )
      const validEmployees = (employeesData || []).filter(employee => 
        employee && employee.id && employee.first_name
      )
      
      setProducts(validProducts)
      setSuppliers(validSuppliers)
      setEmployees(validEmployees)
      
      toast({
        title: "Datos cargados",
        description: `${validProducts.length} productos, ${validSuppliers.length} proveedores y ${validEmployees.length} empleados cargados correctamente.`,
      })
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast({
        title: "Error",
        description: "Error al cargar los datos del inventario. Verifica que el servidor esté funcionando.",
        variant: "destructive",
      })
      
      // Establecer arrays vacíos en caso de error para evitar crashes
      setProducts([])
      setSuppliers([])
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  // Función para crear producto
  const handleCreateProduct = async () => {
    try {
      if (!formData.product_id || !formData.name || !formData.category || !formData.unit || formData.price === undefined) {
        toast({
          title: "Error",
          description: "Por favor complete todos los campos obligatorios.",
          variant: "destructive",
        })
        return
      }

      const newProduct = await createProduct(formData)
      
      // Normalizar tipos de datos del nuevo producto
      const normalizedProduct = {
        ...newProduct,
        price: typeof newProduct.price === 'number' ? newProduct.price : parseFloat(newProduct.price || '0'),
        quantity: typeof newProduct.quantity === 'number' ? newProduct.quantity : parseFloat(newProduct.quantity || '0'),
        min_stock: typeof newProduct.min_stock === 'number' ? newProduct.min_stock : parseFloat(newProduct.min_stock || '0')
      }
      
      setProducts([normalizedProduct, ...products])
      setCreateOpen(false)
      resetFormData()
      
      toast({
        title: "Producto creado",
        description: `El producto ${newProduct.name} ha sido creado exitosamente.`,
      })
    } catch (error: unknown) {
      console.error('Error al crear producto:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear el producto.",
        variant: "destructive",
      })
    }
  }

  // Función para actualizar producto
  const handleUpdateProduct = async () => {
    try {
      if (!productToEdit) return

      const updateData: UpdateProductData = {
        name: formData.name,
        category: formData.category,
        unit: formData.unit,
        quantity: formData.quantity,
        min_stock: formData.min_stock,
        price: formData.price,
        location: formData.location,
        expiry_date: formData.expiry_date || undefined,
        supplier_id: formData.supplier_id,
        description: formData.description
      }

      const updatedProduct = await updateProduct(productToEdit.id, updateData)
      
      // Normalizar tipos de datos del producto actualizado
      const normalizedProduct = {
        ...updatedProduct,
        price: typeof updatedProduct.price === 'number' ? updatedProduct.price : parseFloat(updatedProduct.price || '0'),
        quantity: typeof updatedProduct.quantity === 'number' ? updatedProduct.quantity : parseFloat(updatedProduct.quantity || '0'),
        min_stock: typeof updatedProduct.min_stock === 'number' ? updatedProduct.min_stock : parseFloat(updatedProduct.min_stock || '0')
      }
      
      setProducts(products.map(p => p.id === productToEdit.id ? normalizedProduct : p))
      setEditOpen(false)
      setProductToEdit(null)
      resetFormData()
      
      toast({
        title: "Producto actualizado",
        description: `El producto ${updatedProduct.name} ha sido actualizado exitosamente.`,
      })
    } catch (error: unknown) {
      console.error('Error al actualizar producto:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar el producto.",
        variant: "destructive",
      })
    }
  }

  // Función para eliminar producto
  const handleDeleteProduct = async (product: Product) => {
    try {
      await deleteProduct(product.id)
      setProducts(products.filter(p => p.id !== product.id))
      
      toast({
        title: "Producto eliminado",
        description: `El producto ${product.name} ha sido eliminado exitosamente.`,
      })
    } catch (error: unknown) {
      console.error('Error al eliminar producto:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar el producto.",
        variant: "destructive",
      })
    }
  }

  // Función para registrar movimiento de inventario
  const handleRegisterMovement = async () => {
    try {
      if (!movementData.type || !movementData.productId || !movementData.quantity) {
        toast({
          title: "Error",
          description: "Por favor complete todos los campos obligatorios.",
          variant: "destructive",
        })
        return
      }

      const productId = parseInt(movementData.productId)
      const operation = movementData.type === "entrada" ? "add" : "subtract"
      
      const updatedProduct = await updateProductStock(productId, {
        quantity: movementData.quantity,
        operation
      })

      setProducts(products.map(p => p.id === productId ? updatedProduct : p))
      setMovementDialogOpen(false)
      resetMovementData()
      
      toast({
        title: "Movimiento registrado",
        description: `${movementData.type === "entrada" ? "Entrada" : "Salida"} de ${movementData.quantity} ${updatedProduct.unit} registrada exitosamente.`,
      })
    } catch (error: unknown) {
      console.error('Error al registrar movimiento:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al registrar el movimiento.",
        variant: "destructive",
      })
    }
  }

  // Funciones auxiliares
  const resetFormData = () => {
    setFormData({
      product_id: "",
      name: "",
      category: "Alimento",
      unit: "kg",
      quantity: 0,
      min_stock: 0,
      price: 0,
      location: "",
      expiry_date: "",
      supplier_id: undefined,
      description: ""
    })
  }

  const resetMovementData = () => {
    setMovementData({
      type: "",
      date: "",
      productId: "",
      quantity: 0,
      supplier_id: "",
      document: "",
      employee_id: ""
    })
  }

  const openEditDialog = (product: Product) => {
    setProductToEdit(product)
    setFormData({
      product_id: product.product_id,
      name: product.name,
      category: product.category,
      unit: product.unit,
      quantity: product.quantity,
      min_stock: product.min_stock,
      price: product.price,
      location: product.location || "",
      expiry_date: product.expiry_date ? product.expiry_date.split('T')[0] : "",
      supplier_id: product.supplier_id,
      description: product.description || ""
    })
    setEditOpen(true)
  }

  const openDetailsDialog = (product: Product) => {
    setSelectedProduct(product)
    setDetailsOpen(true)
  }

  // Función para ordenar
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Aplicar filtros y ordenamiento
  let filteredProducts = [...products]

  // Aplicar filtros de búsqueda
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.product_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.supplier?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Aplicar filtros de dropdown
  if (activeFilters.category.length > 0) {
    filteredProducts = filteredProducts.filter((product) => activeFilters.category.includes(product.category))
  }

  if (activeFilters.supplier.length > 0) {
    filteredProducts = filteredProducts.filter((product) => 
      product.supplier && activeFilters.supplier.includes(product.supplier.name)
    )
  }

  // Aplicar ordenamiento
  if (sortConfig !== null) {
    filteredProducts.sort((a, b) => {
      let aValue: string | number = ""
      let bValue: string | number = ""
      
      if (sortConfig.key === 'supplier') {
        aValue = a.supplier?.name || ""
        bValue = b.supplier?.name || ""
      } else {
        aValue = a[sortConfig.key as keyof Product] as string | number
        bValue = b[sortConfig.key as keyof Product] as string | number
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  // Extraer valores únicos para los filtros
  const uniqueCategories = [...new Set(products.map((product) => product.category))]
  const uniqueSupplierNames = [...new Set(products.map((product) => product.supplier?.name).filter((name): name is string => Boolean(name)))]

  // Función para manejar cambios en los filtros
  const handleFilterChange = (type: "category" | "supplier", value: string) => {
    setActiveFilters((prev) => {
      const currentValues = [...prev[type]]
      const valueIndex = currentValues.indexOf(value)

      if (valueIndex === -1) {
        currentValues.push(value)
      } else {
        currentValues.splice(valueIndex, 1)
      }

      return {
        ...prev,
        [type]: currentValues,
      }
    })
  }

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setActiveFilters({
      category: [],
      supplier: [],
    })
    setSearchTerm("")
  }

  // Función para obtener el estado del stock
  const getStockStatus = (product: Product) => {
    if (product.quantity <= 0) return { text: "Sin Stock", variant: "destructive" as const }
    if (product.quantity <= product.min_stock) return { text: "Stock Bajo", variant: "secondary" as const }
    return { text: "Stock Normal", variant: "default" as const }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Cargando inventario...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Inventario</h2>
        <div className="flex gap-2">
          <Dialog open={movementDialogOpen} onOpenChange={setMovementDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ArrowDownUp className="mr-2 h-4 w-4" />
                Registrar Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Registrar Movimiento de Inventario</DialogTitle>
                <DialogDescription>
                  Ingrese los datos del movimiento de inventario. Haga clic en guardar cuando termine.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="movement-type">Tipo de Movimiento</Label>
                    <Select value={movementData.type} onValueChange={(value) => setMovementData({...movementData, type: value})}>
                      <SelectTrigger id="movement-type">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entrada">Entrada</SelectItem>
                        <SelectItem value="salida">Salida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="movement-date">Fecha</Label>
                    <Input 
                      id="movement-date" 
                      type="date" 
                      value={movementData.date}
                      onChange={(e) => setMovementData({...movementData, date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product">Producto</Label>
                  <Select value={movementData.productId} onValueChange={(value) => setMovementData({...movementData, productId: value})}>
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.filter(product => product.id).map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} - {product.product_id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Cantidad</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      placeholder="0" 
                      value={movementData.quantity}
                      onChange={(e) => setMovementData({...movementData, quantity: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unidad</Label>
                    <Input 
                      id="unit" 
                      disabled 
                      value={
                        movementData.productId 
                          ? products.find(p => p.id && p.id.toString() === movementData.productId)?.unit || "" 
                          : ""
                      }
                    />
                  </div>
                </div>
                {movementData.type === "entrada" && (
                  <div className="grid gap-2">
                    <Label htmlFor="supplier">Proveedor</Label>
                    <Select value={movementData.supplier_id} onValueChange={(value) => setMovementData({...movementData, supplier_id: value})}>
                      <SelectTrigger id="supplier">
                        <SelectValue placeholder="Seleccionar proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.filter(supplier => supplier.id).map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id.toString()}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="document">Documento de Referencia</Label>
                  <Input 
                    id="document" 
                    placeholder="Factura, Requisición, etc." 
                    value={movementData.document}
                    onChange={(e) => setMovementData({...movementData, document: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="employee">Empleado</Label>
                  <Select value={movementData.employee_id} onValueChange={(value) => setMovementData({...movementData, employee_id: value})}>
                    <SelectTrigger id="employee">
                      <SelectValue placeholder="Seleccionar empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.filter(employee => employee.id).map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          {employee.first_name} {employee.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setMovementDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleRegisterMovement}>
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Producto</DialogTitle>
                <DialogDescription>
                  Ingrese los datos del nuevo producto para el inventario. Haga clic en guardar cuando termine.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="product-id">ID *</Label>
                    <Input 
                      id="product-id" 
                      placeholder="INV000" 
                      value={formData.product_id}
                      onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-name">Nombre *</Label>
                    <Input 
                      id="product-name" 
                      placeholder="Nombre del producto" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select value={formData.category} onValueChange={(value: Product['category']) => setFormData({...formData, category: value})}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alimento">Alimento</SelectItem>
                        <SelectItem value="Medicamento">Medicamento</SelectItem>
                        <SelectItem value="Suplemento">Suplemento</SelectItem>
                        <SelectItem value="Insumo">Insumo</SelectItem>
                        <SelectItem value="Equipo">Equipo</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unidad *</Label>
                    <Select value={formData.unit} onValueChange={(value: Product['unit']) => setFormData({...formData, unit: value})}>
                      <SelectTrigger id="unit">
                        <SelectValue placeholder="Seleccionar unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                        <SelectItem value="g">Gramos (g)</SelectItem>
                        <SelectItem value="L">Litros (L)</SelectItem>
                        <SelectItem value="ml">Mililitros (ml)</SelectItem>
                        <SelectItem value="unidad">Unidades</SelectItem>
                        <SelectItem value="dosis">Dosis</SelectItem>
                        <SelectItem value="frasco">Frascos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Cantidad Inicial</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      placeholder="0" 
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="min-stock">Stock Mínimo</Label>
                    <Input 
                      id="min-stock" 
                      type="number" 
                      placeholder="0" 
                      value={formData.min_stock}
                      onChange={(e) => setFormData({...formData, min_stock: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Precio *</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input 
                      id="location" 
                      placeholder="Almacén Principal" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expiry-date">Fecha de Vencimiento</Label>
                    <Input 
                      id="expiry-date" 
                      type="date" 
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier">Proveedor</Label>
                  <Select value={formData.supplier_id?.toString() || "none"} onValueChange={(value) => setFormData({...formData, supplier_id: value === "none" ? undefined : parseInt(value)})}>
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin proveedor</SelectItem>
                      {suppliers.filter(supplier => supplier.id).map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input 
                    id="description" 
                    placeholder="Descripción del producto" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleCreateProduct}>
                  Crear Producto
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Categorías</DropdownMenuLabel>
            {uniqueCategories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={activeFilters.category.includes(category)}
                onCheckedChange={() => handleFilterChange("category", category)}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Proveedores</DropdownMenuLabel>
            {uniqueSupplierNames.map((supplier) => (
              <DropdownMenuCheckboxItem
                key={supplier}
                checked={activeFilters.supplier.includes(supplier)}
                onCheckedChange={() => handleFilterChange("supplier", supplier)}
              >
                {supplier}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearFilters}>
              Limpiar filtros
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabla de productos */}
      <Card>
        <CardHeader>
          <CardTitle>Productos en Inventario</CardTitle>
          <CardDescription>
            {filteredProducts.length} productos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => requestSort("product_id")}>
                    ID {sortConfig?.key === "product_id" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort("name")}>
                    Nombre {sortConfig?.key === "name" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort("category")}>
                    Categoría {sortConfig?.key === "category" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort("quantity")}>
                    Cantidad {sortConfig?.key === "quantity" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Stock Mínimo</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort("price")}>
                    Precio {sortConfig?.key === "price" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort("supplier")}>
                    Proveedor {sortConfig?.key === "supplier" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product)
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.product_id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.quantity} {product.unit}</TableCell>
                      <TableCell>{product.min_stock} {product.unit}</TableCell>
                      <TableCell>${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price || '0').toFixed(2)}</TableCell>
                      <TableCell>{product.supplier?.name || "Sin proveedor"}</TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.text}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDetailsDialog(product)}
                          >
                            Ver
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de edición */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Modifique los datos del producto. Los campos marcados con * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-product-id">ID</Label>
                <Input 
                  id="edit-product-id" 
                  value={formData.product_id}
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-product-name">Nombre *</Label>
                <Input 
                  id="edit-product-name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Categoría *</Label>
                <Select value={formData.category} onValueChange={(value: Product['category']) => setFormData({...formData, category: value})}>
                  <SelectTrigger id="edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alimento">Alimento</SelectItem>
                    <SelectItem value="Medicamento">Medicamento</SelectItem>
                    <SelectItem value="Suplemento">Suplemento</SelectItem>
                    <SelectItem value="Insumo">Insumo</SelectItem>
                    <SelectItem value="Equipo">Equipo</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-unit">Unidad *</Label>
                <Select value={formData.unit} onValueChange={(value: Product['unit']) => setFormData({...formData, unit: value})}>
                  <SelectTrigger id="edit-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                    <SelectItem value="g">Gramos (g)</SelectItem>
                    <SelectItem value="L">Litros (L)</SelectItem>
                    <SelectItem value="ml">Mililitros (ml)</SelectItem>
                    <SelectItem value="unidad">Unidades</SelectItem>
                    <SelectItem value="dosis">Dosis</SelectItem>
                    <SelectItem value="frasco">Frascos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-quantity">Cantidad</Label>
                <Input 
                  id="edit-quantity" 
                  type="number" 
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-min-stock">Stock Mínimo</Label>
                <Input 
                  id="edit-min-stock" 
                  type="number" 
                  value={formData.min_stock}
                  onChange={(e) => setFormData({...formData, min_stock: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Precio *</Label>
                <Input 
                  id="edit-price" 
                  type="number" 
                  step="0.01" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Ubicación</Label>
                <Input 
                  id="edit-location" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-expiry-date">Fecha de Vencimiento</Label>
                <Input 
                  id="edit-expiry-date" 
                  type="date" 
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-supplier">Proveedor</Label>
              <Select value={formData.supplier_id?.toString() || "none"} onValueChange={(value) => setFormData({...formData, supplier_id: value === "none" ? undefined : parseInt(value)})}>
                <SelectTrigger id="edit-supplier">
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin proveedor</SelectItem>
                  {suppliers.filter(supplier => supplier.id).map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Input 
                id="edit-description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleUpdateProduct}>
              Actualizar Producto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de detalles */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles del Producto</DialogTitle>
            <DialogDescription>
              Información completa del producto seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">ID:</Label>
                  <p>{selectedProduct.product_id}</p>
                </div>
                <div>
                  <Label className="font-semibold">Nombre:</Label>
                  <p>{selectedProduct.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Categoría:</Label>
                  <p>{selectedProduct.category}</p>
                </div>
                <div>
                  <Label className="font-semibold">Unidad:</Label>
                  <p>{selectedProduct.unit}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="font-semibold">Cantidad:</Label>
                  <p>{selectedProduct.quantity} {selectedProduct.unit}</p>
                </div>
                <div>
                  <Label className="font-semibold">Stock Mínimo:</Label>
                  <p>{selectedProduct.min_stock} {selectedProduct.unit}</p>
                </div>
                <div>
                  <Label className="font-semibold">Precio:</Label>
                  <p>${typeof selectedProduct.price === 'number' ? selectedProduct.price.toFixed(2) : parseFloat(selectedProduct.price || '0').toFixed(2)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Ubicación:</Label>
                  <p>{selectedProduct.location || "No especificada"}</p>
                </div>
                <div>
                  <Label className="font-semibold">Fecha de Vencimiento:</Label>
                  <p>{selectedProduct.expiry_date ? new Date(selectedProduct.expiry_date).toLocaleDateString() : "No especificada"}</p>
                </div>
              </div>
              <div>
                <Label className="font-semibold">Proveedor:</Label>
                <p>{selectedProduct.supplier?.name || "Sin proveedor"}</p>
              </div>
              <div>
                <Label className="font-semibold">Descripción:</Label>
                <p>{selectedProduct.description || "Sin descripción"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Creado:</Label>
                  <p>{selectedProduct.created_at ? new Date(selectedProduct.created_at).toLocaleDateString() : "No disponible"}</p>
                </div>
                <div>
                  <Label className="font-semibold">Última actualización:</Label>
                  <p>{selectedProduct.updated_at ? new Date(selectedProduct.updated_at).toLocaleDateString() : "No disponible"}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" onClick={() => setDetailsOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

