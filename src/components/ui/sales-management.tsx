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
import { ArrowUpDown, Calendar, FileDown, Filter, Plus, Search, User, DollarSign } from "lucide-react"
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
const salesData = [
  {
    id: "VEN001",
    date: "2023-04-15",
    product: "Leche",
    quantity: 25,
    unit: "L",
    price: 5,
    total: 125,
    customer: "Lácteos Regionales",
    paymentMethod: "Transferencia",
    paymentStatus: "Pagado",
    notes: "Entrega semanal",
  },
  {
    id: "VEN002",
    date: "2023-04-12",
    product: "Leche",
    quantity: 30,
    unit: "L",
    price: 5,
    total: 150,
    customer: "Tienda Orgánica",
    paymentMethod: "Efectivo",
    paymentStatus: "Pagado",
    notes: "Cliente nuevo",
  },
  {
    id: "VEN003",
    date: "2023-04-10",
    product: "Queso",
    quantity: 5,
    unit: "kg",
    price: 12,
    total: 60,
    customer: "Restaurante El Sabor",
    paymentMethod: "Crédito",
    paymentStatus: "Pendiente",
    notes: "Pago a 15 días",
  },
  {
    id: "VEN004",
    date: "2023-04-05",
    product: "Cabrito",
    quantity: 1,
    unit: "unidad",
    price: 120,
    total: 120,
    customer: "Carnicería Local",
    paymentMethod: "Transferencia",
    paymentStatus: "Pagado",
    notes: "Entrega en carnicería",
  },
  {
    id: "VEN005",
    date: "2023-04-01",
    product: "Leche",
    quantity: 20,
    unit: "L",
    price: 5,
    total: 100,
    customer: "Lácteos Regionales",
    paymentMethod: "Transferencia",
    paymentStatus: "Pagado",
    notes: "Entrega semanal",
  },
  {
    id: "VEN006",
    date: "2023-03-28",
    product: "Yogurt",
    quantity: 15,
    unit: "L",
    price: 8,
    total: 120,
    customer: "Tienda Orgánica",
    paymentMethod: "Efectivo",
    paymentStatus: "Pagado",
    notes: "Producto nuevo",
  },
  {
    id: "VEN007",
    date: "2023-03-25",
    product: "Queso",
    quantity: 8,
    unit: "kg",
    price: 12,
    total: 96,
    customer: "Restaurante El Sabor",
    paymentMethod: "Crédito",
    paymentStatus: "Pendiente",
    notes: "Pago a 15 días",
  },
  {
    id: "VEN008",
    date: "2023-03-20",
    product: "Leche",
    quantity: 25,
    unit: "L",
    price: 5,
    total: 125,
    customer: "Lácteos Regionales",
    paymentMethod: "Transferencia",
    paymentStatus: "Pagado",
    notes: "Entrega semanal",
  },
]

// Datos de ejemplo para clientes
const customers = [
  {
    id: "CLI001",
    name: "Lácteos Regionales",
    contact: "Juan Pérez",
    phone: "555-123-4567",
    email: "juan@lacteosregionales.com",
  },
  {
    id: "CLI002",
    name: "Tienda Orgánica",
    contact: "María López",
    phone: "555-234-5678",
    email: "maria@tiendaorganica.com",
  },
  {
    id: "CLI003",
    name: "Restaurante El Sabor",
    contact: "Carlos Gómez",
    phone: "555-345-6789",
    email: "carlos@elsabor.com",
  },
  {
    id: "CLI004",
    name: "Carnicería Local",
    contact: "Ana Martínez",
    phone: "555-456-7890",
    email: "ana@carnicerialocal.com",
  },
]

export function SalesManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)
  const [activeFilters, setActiveFilters] = useState<{
    product: string[]
    customer: string[]
    paymentStatus: string[]
  }>({
    product: [],
    customer: [],
    paymentStatus: [],
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
  let filteredSales = [...salesData]

  // Aplicar filtros de búsqueda
  if (searchTerm) {
    filteredSales = filteredSales.filter(
      (sale) =>
        sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Aplicar filtros de dropdown
  if (activeFilters.product.length > 0) {
    filteredSales = filteredSales.filter((sale) => activeFilters.product.includes(sale.product))
  }

  if (activeFilters.customer.length > 0) {
    filteredSales = filteredSales.filter((sale) => activeFilters.customer.includes(sale.customer))
  }

  if (activeFilters.paymentStatus.length > 0) {
    filteredSales = filteredSales.filter((sale) => activeFilters.paymentStatus.includes(sale.paymentStatus))
  }

  // Aplicar ordenamiento
  if (sortConfig !== null) {
    filteredSales.sort((a, b) => {
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
  const uniqueProducts = [...new Set(salesData.map((sale) => sale.product))]
  const uniqueCustomers = [...new Set(salesData.map((sale) => sale.customer))]
  const uniquePaymentStatuses = [...new Set(salesData.map((sale) => sale.paymentStatus))]

  // Función para manejar cambios en los filtros
  const handleFilterChange = (type: "product" | "customer" | "paymentStatus", value: string) => {
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
      product: [],
      customer: [],
      paymentStatus: [],
    })
    setSearchTerm("")
  }

  const [selectedSale, setSelectedSale] = useState<(typeof salesData)[0] | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Ventas</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Venta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Venta</DialogTitle>
              <DialogDescription>
                Ingrese los datos de la nueva venta. Haga clic en guardar cuando termine.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sale-id">ID</Label>
                  <Input id="sale-id" placeholder="VEN000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sale-date">Fecha</Label>
                  <Input id="sale-date" type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="product">Producto</Label>
                  <Select>
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leche">Leche</SelectItem>
                      <SelectItem value="queso">Queso</SelectItem>
                      <SelectItem value="yogurt">Yogurt</SelectItem>
                      <SelectItem value="cabrito">Cabrito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customer">Cliente</Label>
                  <Select>
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input id="quantity" type="number" placeholder="0" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unidad</Label>
                  <Select>
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="l">Litros (L)</SelectItem>
                      <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                      <SelectItem value="unidad">Unidades</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Precio Unitario</Label>
                  <Input id="price" type="number" placeholder="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="payment-method">Método de Pago</Label>
                  <Select>
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Seleccionar método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="credito">Crédito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="payment-status">Estado de Pago</Label>
                  <Select>
                    <SelectTrigger id="payment-status">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pagado">Pagado</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notas</Label>
                <Input id="notes" placeholder="Observaciones adicionales" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="milk">Leche</TabsTrigger>
          <TabsTrigger value="cheese">Queso</TabsTrigger>
          <TabsTrigger value="meat">Carne</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Listado de Ventas</CardTitle>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar por ID, producto o cliente..."
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
                        {(activeFilters.product.length > 0 ||
                          activeFilters.customer.length > 0 ||
                          activeFilters.paymentStatus.length > 0) && (
                          <Badge variant="secondary" className="ml-2 rounded-full">
                            {activeFilters.product.length +
                              activeFilters.customer.length +
                              activeFilters.paymentStatus.length}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuLabel className="font-normal">Producto</DropdownMenuLabel>
                      {uniqueProducts.map((product) => (
                        <DropdownMenuCheckboxItem
                          key={product}
                          checked={activeFilters.product.includes(product)}
                          onCheckedChange={() => handleFilterChange("product", product)}
                        >
                          {product}
                        </DropdownMenuCheckboxItem>
                      ))}

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="font-normal">Cliente</DropdownMenuLabel>
                      {uniqueCustomers.map((customer) => (
                        <DropdownMenuCheckboxItem
                          key={customer}
                          checked={activeFilters.customer.includes(customer)}
                          onCheckedChange={() => handleFilterChange("customer", customer)}
                        >
                          {customer}
                        </DropdownMenuCheckboxItem>
                      ))}

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="font-normal">Estado de Pago</DropdownMenuLabel>
                      {uniquePaymentStatuses.map((status) => (
                        <DropdownMenuCheckboxItem
                          key={status}
                          checked={activeFilters.paymentStatus.includes(status)}
                          onCheckedChange={() => handleFilterChange("paymentStatus", status)}
                        >
                          {status}
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
                        <div className="flex items-center space-x-1 cursor-pointer" onClick={() => requestSort("date")}>
                          <span>Fecha</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div
                          className="flex items-center space-x-1 cursor-pointer"
                          onClick={() => requestSort("product")}
                        >
                          <span>Producto</span>
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
                        <div
                          className="flex items-center space-x-1 cursor-pointer"
                          onClick={() => requestSort("total")}
                        >
                          <span>Total</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        <div
                          className="flex items-center space-x-1 cursor-pointer"
                          onClick={() => requestSort("customer")}
                        >
                          <span>Cliente</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        <div
                          className="flex items-center space-x-1 cursor-pointer"
                          onClick={() => requestSort("paymentStatus")}
                        >
                          <span>Estado</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-24">
                          No se encontraron registros que coincidan con los criterios de búsqueda.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">{sale.id}</TableCell>
                          <TableCell>{sale.date}</TableCell>
                          <TableCell>{sale.product}</TableCell>
                          <TableCell>
                            {sale.quantity} {sale.unit}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">${sale.total}</TableCell>
                          <TableCell className="hidden lg:table-cell">{sale.customer}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant={sale.paymentStatus === "Pagado" ? "default" : "secondary"}>
                              {sale.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedSale(sale)
                                  setDetailsOpen(true)
                                }}
                              >
                                Detalles
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileDown className="h-4 w-4" />
                                <span className="sr-only">PDF</span>
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
                Mostrando {filteredSales.length} de {salesData.length} registros
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
        <TabsContent value="milk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ventas de Leche</CardTitle>
              <CardDescription>Listado de ventas de leche</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenido filtrado para ventas de leche se mostrará aquí.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cheese" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ventas de Queso</CardTitle>
              <CardDescription>Listado de ventas de queso</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenido filtrado para ventas de queso se mostrará aquí.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="meat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ventas de Carne</CardTitle>
              <CardDescription>Listado de ventas de carne</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenido filtrado para ventas de carne se mostrará aquí.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de detalles */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles de la Venta</DialogTitle>
            <DialogDescription>Información detallada de la venta seleccionada.</DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Información General
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p>
                      <span className="font-medium">ID:</span> {selectedSale.id}
                    </p>
                    <p>
                      <span className="font-medium">Fecha:</span> {selectedSale.date}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" /> Cliente
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p>{selectedSale.customer}</p>
                    <p>{customers.find((c) => c.name === selectedSale.customer)?.contact}</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Detalle del Producto</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Producto</p>
                    <p>{selectedSale.product}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cantidad</p>
                    <p>
                      {selectedSale.quantity} {selectedSale.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Precio Unit.</p>
                    <p>${selectedSale.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-bold">${selectedSale.total}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> Información de Pago
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p>
                      <span className="font-medium">Método:</span> {selectedSale.paymentMethod}
                    </p>
                    <p>
                      <span className="font-medium">Estado:</span>
                      <Badge
                        variant={selectedSale.paymentStatus === "Pagado" ? "default" : "secondary"}
                        className="ml-2"
                      >
                        {selectedSale.paymentStatus}
                      </Badge>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Notas</h3>
                  <p className="mt-2">{selectedSale.notes}</p>
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
    </div>
  )
}

