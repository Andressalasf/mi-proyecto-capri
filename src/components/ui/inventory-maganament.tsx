"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpDown, Edit, FileDown, Filter, Plus, Search, Trash2, ArrowDownUp } from "lucide-react"
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

// Datos de ejemplo
const inventoryItems = [
  {
    id: "INV001",
    name: "Alimento Balanceado",
    category: "Alimento",
    quantity: 500,
    unit: "kg",
    lastUpdate: "2023-04-15",
    supplier: "Alimentos Naturales S.A.",
    location: "Almacén Principal",
    minStock: 100,
    price: 2.5,
    expiryDate: "2023-12-15",
  },
  {
    id: "INV002",
    name: "Heno de Alfalfa",
    category: "Alimento",
    quantity: 200,
    unit: "kg",
    lastUpdate: "2023-04-10",
    supplier: "Forrajes del Valle",
    location: "Almacén Principal",
    minStock: 50,
    price: 1.8,
    expiryDate: "2023-10-10",
  },
  {
    id: "INV003",
    name: "Vacuna Clostridial",
    category: "Medicamento",
    quantity: 50,
    unit: "dosis",
    lastUpdate: "2023-03-22",
    supplier: "Medicamentos Veterinarios",
    location: "Refrigerador",
    minStock: 10,
    price: 3.2,
    expiryDate: "2024-03-22",
  },
  {
    id: "INV004",
    name: "Desparasitante",
    category: "Medicamento",
    quantity: 30,
    unit: "dosis",
    lastUpdate: "2023-04-05",
    supplier: "Medicamentos Veterinarios",
    location: "Botiquín",
    minStock: 5,
    price: 4.5,
    expiryDate: "2024-04-05",
  },
  {
    id: "INV005",
    name: "Sal Mineral",
    category: "Suplemento",
    quantity: 100,
    unit: "kg",
    lastUpdate: "2023-04-12",
    supplier: "Suplementos Minerales",
    location: "Almacén Principal",
    minStock: 20,
    price: 3.0,
    expiryDate: "2024-04-12",
  },
  {
    id: "INV006",
    name: "Jeringas",
    category: "Insumo",
    quantity: 200,
    unit: "unidad",
    lastUpdate: "2023-03-15",
    supplier: "Medicamentos Veterinarios",
    location: "Botiquín",
    minStock: 50,
    price: 0.5,
    expiryDate: "2025-03-15",
  },
  {
    id: "INV007",
    name: "Concentrado Proteico",
    category: "Alimento",
    quantity: 150,
    unit: "kg",
    lastUpdate: "2023-04-08",
    supplier: "Alimentos Naturales S.A.",
    location: "Almacén Principal",
    minStock: 30,
    price: 3.8,
    expiryDate: "2023-10-08",
  },
  {
    id: "INV008",
    name: "Vitaminas",
    category: "Suplemento",
    quantity: 40,
    unit: "frasco",
    lastUpdate: "2023-03-30",
    supplier: "Suplementos Minerales",
    location: "Botiquín",
    minStock: 10,
    price: 12.5,
    expiryDate: "2024-03-30",
  },
]

// Datos de ejemplo para movimientos de inventario
const inventoryMovements = [
  {
    id: "MOV001",
    date: "2023-04-15",
    type: "Entrada",
    product: "Alimento Balanceado",
    quantity: 200,
    unit: "kg",
    supplier: "Alimentos Naturales S.A.",
    document: "FAC-12345",
    user: "Pedro Agropecuario",
  },
  {
    id: "MOV002",
    date: "2023-04-12",
    type: "Salida",
    product: "Alimento Balanceado",
    quantity: 50,
    unit: "kg",
    supplier: "-",
    document: "REQ-001",
    user: "Pedro Agropecuario",
  },
  {
    id: "MOV003",
    date: "2023-04-10",
    type: "Entrada",
    product: "Heno de Alfalfa",
    quantity: 100,
    unit: "kg",
    supplier: "Forrajes del Valle",
    document: "FAC-6789",
    user: "Pedro Agropecuario",
  },
  {
    id: "MOV004",
    date: "2023-04-08",
    type: "Entrada",
    product: "Vacuna Clostridial",
    quantity: 20,
    unit: "dosis",
    supplier: "Medicamentos Veterinarios",
    document: "FAC-5432",
    user: "Pedro Agropecuario",
  },
  {
    id: "MOV005",
    date: "2023-04-05",
    type: "Salida",
    product: "Vacuna Clostridial",
    quantity: 10,
    unit: "dosis",
    supplier: "-",
    document: "REQ-002",
    user: "Pedro Agropecuario",
  },
  {
    id: "MOV006",
    date: "2023-04-03",
    type: "Entrada",
    product: "Sal Mineral",
    quantity: 50,
    unit: "kg",
    supplier: "Suplementos Minerales",
    document: "FAC-7890",
    user: "Pedro Agropecuario",
  },
  {
    id: "MOV007",
    date: "2023-04-01",
    type: "Salida",
    product: "Heno de Alfalfa",
    quantity: 30,
    unit: "kg",
    supplier: "-",
    document: "REQ-003",
    user: "Pedro Agropecuario",
  },
  {
    id: "MOV008",
    date: "2023-03-30",
    type: "Entrada",
    product: "Desparasitante",
    quantity: 15,
    unit: "dosis",
    supplier: "Medicamentos Veterinarios",
    document: "FAC-4321",
    user: "Pedro Agropecuario",
  },
]

// Datos de ejemplo para empleados
const employees = [
  { id: "EMP001", firstName: "Pedro", lastName: "Agropecuario" },
  { id: "EMP002", firstName: "Maria", lastName: "Veterinaria" },
]

export function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)
  const [activeFilters, setActiveFilters] = useState<{
    category: string[]
    supplier: string[]
  }>({
    category: [],
    supplier: [],
  })

  // Función para ordenar
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Aplicar filtros y ordenamiento
  let filteredItems = [...inventoryItems]

  // Aplicar filtros de búsqueda
  if (searchTerm) {
    filteredItems = filteredItems.filter(
      (item) =>
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Aplicar filtros de dropdown
  if (activeFilters.category.length > 0) {
    filteredItems = filteredItems.filter((item) => activeFilters.category.includes(item.category))
  }

  if (activeFilters.supplier.length > 0) {
    filteredItems = filteredItems.filter((item) => activeFilters.supplier.includes(item.supplier))
  }

  // Aplicar ordenamiento
  if (sortConfig !== null) {
    filteredItems.sort((a, b) => {
      if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  // Extraer valores únicos para los filtros
  const uniqueCategories = [...new Set(inventoryItems.map((item) => item.category))]
  const uniqueSuppliers = [...new Set(inventoryItems.map((item) => item.supplier))]

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

  const [selectedItem, setSelectedItem] = useState<(typeof inventoryItems)[0] | null>(null)
  // Agregar un nuevo estado para controlar el diálogo de edición
  const [editOpen, setEditOpen] = useState(false)

  // Agregar esta línea después de la declaración de selectedItem
  const [itemToEdit, setItemToEdit] = useState<(typeof inventoryItems)[0] | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [movementDetailsOpen, setMovementDetailsOpen] = useState(false)
  const [selectedMovement, setSelectedMovement] = useState<(typeof inventoryMovements)[0] | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Inventario</h2>
        <div className="flex gap-2">
          <Dialog>
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
                    <Select>
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
                    <Input id="movement-date" type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product">Producto</Label>
                  <Select>
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Cantidad</Label>
                    <Input id="quantity" type="number" placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unidad</Label>
                    <Input id="unit" disabled />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier">Proveedor (solo para entradas)</Label>
                  <Select>
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueSuppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="document">Documento de Referencia</Label>
                  <Input id="document" placeholder="Factura, Requisición, etc." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="employee">Empleado</Label>
                  <Select>
                    <SelectTrigger id="employee">
                      <SelectValue placeholder="Seleccionar empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
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
                    <Label htmlFor="product-id">ID</Label>
                    <Input id="product-id" placeholder="INV000" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-name">Nombre</Label>
                    <Input id="product-name" placeholder="Nombre del producto" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alimento">Alimento</SelectItem>
                        <SelectItem value="medicamento">Medicamento</SelectItem>
                        <SelectItem value="suplemento">Suplemento</SelectItem>
                        <SelectItem value="insumo">Insumo</SelectItem>
                        <SelectItem value="equipo">Equipo</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unidad</Label>
                    <Select>
                      <SelectTrigger id="unit">
                        <SelectValue placeholder="Seleccionar unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                        <SelectItem value="g">Gramos (g)</SelectItem>
                        <SelectItem value="l">Litros (L)</SelectItem>
                        <SelectItem value="ml">Mililitros (ml)</SelectItem>
                        <SelectItem value="unidad">Unidades</SelectItem>
                        <SelectItem value="dosis">Dosis</SelectItem>
                        <SelectItem value="frasco">Frascos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Cantidad Inicial</Label>
                    <Input id="quantity" type="number" placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="min-stock">Stock Mínimo</Label>
                    <Input id="min-stock" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Precio Unitario</Label>
                    <Input id="price" type="number" placeholder="0.00" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expiry-date">Fecha de Vencimiento</Label>
                    <Input id="expiry-date" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="supplier">Proveedor</Label>
                    <Select>
                      <SelectTrigger id="supplier">
                        <SelectValue placeholder="Seleccionar proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueSuppliers.map((supplier) => (
                          <SelectItem key={supplier} value={supplier}>
                            {supplier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input id="location" placeholder="Ubicación en almacén" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="movements">Movimientos</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Listado de Productos</CardTitle>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar por ID, nombre o categoría..."
                      className="pl-8 w-full sm:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                        {(activeFilters.category.length > 0 || activeFilters.supplier.length > 0) && (
                          <Badge variant="secondary" className="ml-2 rounded-full">
                            {activeFilters.category.length + activeFilters.supplier.length}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuLabel className="font-normal">Categoría</DropdownMenuLabel>
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
                      <DropdownMenuLabel className="font-normal">Proveedor</DropdownMenuLabel>
                      {uniqueSuppliers.map((supplier) => (
                        <DropdownMenuCheckboxItem
                          key={supplier}
                          checked={activeFilters.supplier.includes(supplier)}
                          onCheckedChange={() => handleFilterChange("supplier", supplier)}
                        >
                          {supplier}
                        </DropdownMenuCheckboxItem>
                      ))}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={clearFilters}>Limpiar filtros</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="outline" size="icon">
                    <FileDown className="h-4 w-4" />
                    <span className="sr-only">Descargar PDF</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">
                        <div className="flex items-center space-x-1 cursor-pointer" onClick={() => requestSort("id")}>
                          <span>ID</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1 cursor-pointer" onClick={() => requestSort("name")}>
                          <span>Nombre</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div
                          className="flex items-center space-x-1 cursor-pointer"
                          onClick={() => requestSort("category")}
                        >
                          <span>Categoría</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div
                          className="flex items-center space-x-1 cursor-pointer"
                          onClick={() => requestSort("quantity")}
                        >
                          <span>Cantidad</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <div className="flex items-center space-x-1 cursor-pointer" onClick={() => requestSort("unit")}>
                          <span>Unidad</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        <div
                          className="flex items-center space-x-1 cursor-pointer"
                          onClick={() => requestSort("supplier")}
                        >
                          <span>Proveedor</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        <div
                          className="flex items-center space-x-1 cursor-pointer"
                          onClick={() => requestSort("lastUpdate")}
                        >
                          <span>Última Act.</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-24">
                          No se encontraron registros que coincidan con los criterios de búsqueda.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="hidden md:table-cell">{item.unit}</TableCell>
                          <TableCell className="hidden lg:table-cell">{item.supplier}</TableCell>
                          <TableCell className="hidden lg:table-cell">{item.lastUpdate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedItem(item)
                                  setDetailsOpen(true)
                                }}
                              >
                                Detalles
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setItemToEdit(item)
                                  setEditOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Eliminar</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
              <div className="text-sm text-muted-foreground">
                Mostrando {filteredItems.length} de {inventoryItems.length} registros
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Siguiente
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos de Inventario</CardTitle>
              <CardDescription>Registro de entradas y salidas de productos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead className="hidden md:table-cell">Documento</TableHead>
                      <TableHead className="hidden lg:table-cell">Usuario</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryMovements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="font-medium">{movement.id}</TableCell>
                        <TableCell>{movement.date}</TableCell>
                        <TableCell>
                          <Badge variant={movement.type === "Entrada" ? "default" : "secondary"}>{movement.type}</Badge>
                        </TableCell>
                        <TableCell>{movement.product}</TableCell>
                        <TableCell>
                          {movement.quantity} {movement.unit}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{movement.document}</TableCell>
                        <TableCell className="hidden lg:table-cell">{movement.user}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedMovement(movement)
                              setMovementDetailsOpen(true)
                            }}
                          >
                            Detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Inventario</CardTitle>
              <CardDescription>Productos con bajo stock o próximos a vencer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Productos con Bajo Stock</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Stock Actual</TableHead>
                        <TableHead>Stock Mínimo</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryItems
                        .filter((item) => item.quantity <= item.minStock)
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell className="text-red-500 font-medium">
                              {item.quantity} {item.unit}
                            </TableCell>
                            <TableCell>
                              {item.minStock} {item.unit}
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Ordenar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>

                <h3 className="text-lg font-medium mt-6">Productos Próximos a Vencer</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Fecha de Vencimiento</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryItems
                        .filter((item) => {
                          const expiryDate = new Date(item.expiryDate)
                          const today = new Date()
                          const diffTime = expiryDate.getTime() - today.getTime()
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                          return diffDays <= 30
                        })
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell className="text-amber-500 font-medium">{item.expiryDate}</TableCell>
                            <TableCell>
                              {item.quantity} {item.unit}
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Gestionar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de detalles del producto */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles del Producto</DialogTitle>
            <DialogDescription>Información detallada del producto seleccionado.</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">ID</h3>
                  <p>{selectedItem.id}</p>
                </div>
                <div>
                  <h3 className="font-medium">Nombre</h3>
                  <p>{selectedItem.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Categoría</h3>
                  <p>{selectedItem.category}</p>
                </div>
                <div>
                  <h3 className="font-medium">Cantidad</h3>
                  <p>
                    {selectedItem.quantity} {selectedItem.unit}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Proveedor</h3>
                  <p>{selectedItem.supplier}</p>
                </div>
                <div>
                  <h3 className="font-medium">Ubicación</h3>
                  <p>{selectedItem.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Stock Mínimo</h3>
                  <p>
                    {selectedItem.minStock} {selectedItem.unit}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Precio Unitario</h3>
                  <p>${selectedItem.price}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Fecha de Vencimiento</h3>
                  <p>{selectedItem.expiryDate}</p>
                </div>
                <div>
                  <h3 className="font-medium">Última Actualización</h3>
                  <p>{selectedItem.lastUpdate}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Cerrar
            </Button>
            <Button>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de detalles del movimiento */}
      <Dialog open={movementDetailsOpen} onOpenChange={setMovementDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles del Movimiento</DialogTitle>
            <DialogDescription>Información detallada del movimiento de inventario seleccionado.</DialogDescription>
          </DialogHeader>
          {selectedMovement && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">ID</h3>
                  <p>{selectedMovement.id}</p>
                </div>
                <div>
                  <h3 className="font-medium">Fecha</h3>
                  <p>{selectedMovement.date}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Tipo</h3>
                  <Badge variant={selectedMovement.type === "Entrada" ? "default" : "secondary"}>
                    {selectedMovement.type}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-medium">Producto</h3>
                  <p>{selectedMovement.product}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Cantidad</h3>
                  <p>
                    {selectedMovement.quantity} {selectedMovement.unit}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Proveedor</h3>
                  <p>{selectedMovement.supplier}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Documento</h3>
                  <p>{selectedMovement.document}</p>
                </div>
                <div>
                  <h3 className="font-medium">Usuario</h3>
                  <p>{selectedMovement.user}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setMovementDetailsOpen(false)}>
              Cerrar
            </Button>
            <Button>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de edición */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Modifique los datos del producto. Haga clic en guardar cuando termine.
            </DialogDescription>
          </DialogHeader>
          {itemToEdit && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-product-id">ID</Label>
                  <Input id="edit-product-id" defaultValue={itemToEdit.id} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-product-name">Nombre</Label>
                  <Input id="edit-product-name" defaultValue={itemToEdit.name} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Categoría</Label>
                  <Select defaultValue={itemToEdit.category.toLowerCase()}>
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alimento">Alimento</SelectItem>
                      <SelectItem value="medicamento">Medicamento</SelectItem>
                      <SelectItem value="suplemento">Suplemento</SelectItem>
                      <SelectItem value="insumo">Insumo</SelectItem>
                      <SelectItem value="equipo">Equipo</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-unit">Unidad</Label>
                  <Select defaultValue={itemToEdit.unit.toLowerCase()}>
                    <SelectTrigger id="edit-unit">
                      <SelectValue placeholder="Seleccionar unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                      <SelectItem value="g">Gramos (g)</SelectItem>
                      <SelectItem value="l">Litros (L)</SelectItem>
                      <SelectItem value="ml">Mililitros (ml)</SelectItem>
                      <SelectItem value="unidad">Unidades</SelectItem>
                      <SelectItem value="dosis">Dosis</SelectItem>
                      <SelectItem value="frasco">Frascos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-quantity">Cantidad</Label>
                  <Input id="edit-quantity" type="number" defaultValue={itemToEdit.quantity} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-min-stock">Stock Mínimo</Label>
                  <Input id="edit-min-stock" type="number" defaultValue={itemToEdit.minStock} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Precio Unitario</Label>
                  <Input id="edit-price" type="number" defaultValue={itemToEdit.price} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-expiry-date">Fecha de Vencimiento</Label>
                  <Input id="edit-expiry-date" type="date" defaultValue={itemToEdit.expiryDate} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-supplier">Proveedor</Label>
                  <Select defaultValue={itemToEdit.supplier.replace(/\s+/g, "-").toLowerCase()}>
                    <SelectTrigger id="edit-supplier">
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueSuppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier.replace(/\s+/g, "-").toLowerCase()}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-location">Ubicación</Label>
                  <Input id="edit-location" defaultValue={itemToEdit.location} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                // Aquí iría la lógica para guardar los cambios
                setEditOpen(false)
                // Mostrar notificación de éxito
                alert("Producto actualizado correctamente")
              }}
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

