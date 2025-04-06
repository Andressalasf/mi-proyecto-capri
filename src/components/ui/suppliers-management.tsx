"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowUpDown, Edit, FileDown, Filter, Plus, Search, Trash2, MapPin, Phone, Mail } from "lucide-react"
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
const suppliers = [
  {
    id: "PROV001",
    name: "Alimentos Naturales S.A.",
    contact: "Juan Pérez",
    phone: "555-123-4567",
    email: "juan@alimentosnaturales.com",
    address: "Calle Principal 123, Ciudad",
    category: "Alimentos",
    status: "Activo",
    lastPurchase: "2023-04-10",
    notes: "Proveedor principal de alimentos balanceados",
  },
  {
    id: "PROV002",
    name: "Medicamentos Veterinarios",
    contact: "María Gómez",
    phone: "555-987-6543",
    email: "maria@medvet.com",
    address: "Av. Central 456, Ciudad",
    category: "Medicamentos",
    status: "Activo",
    lastPurchase: "2023-03-22",
    notes: "Proveedor de vacunas y medicamentos",
  },
  {
    id: "PROV003",
    name: "Equipos Agrícolas",
    contact: "Roberto Sánchez",
    phone: "555-456-7890",
    email: "roberto@equiposagricolas.com",
    address: "Carretera Norte Km 5, Ciudad",
    category: "Equipos",
    status: "Inactivo",
    lastPurchase: "2022-11-15",
    notes: "Proveedor de equipos de ordeño",
  },
  {
    id: "PROV004",
    name: "Suplementos Minerales",
    contact: "Ana Martínez",
    phone: "555-234-5678",
    email: "ana@suplementos.com",
    address: "Calle 10 #45, Ciudad",
    category: "Suplementos",
    status: "Activo",
    lastPurchase: "2023-04-05",
    notes: "Proveedor de sales minerales y suplementos",
  },
  {
    id: "PROV005",
    name: "Transportes Rápidos",
    contact: "Carlos López",
    phone: "555-345-6789",
    email: "carlos@transportes.com",
    address: "Av. Sur 789, Ciudad",
    category: "Servicios",
    status: "Activo",
    lastPurchase: "2023-03-30",
    notes: "Servicio de transporte de animales",
  },
  {
    id: "PROV006",
    name: "Forrajes del Valle",
    contact: "Luisa Ramírez",
    phone: "555-567-8901",
    email: "luisa@forrajesvalle.com",
    address: "Camino Rural 234, Ciudad",
    category: "Alimentos",
    status: "Activo",
    lastPurchase: "2023-04-12",
    notes: "Proveedor de heno y forrajes",
  },
  {
    id: "PROV007",
    name: "Herramientas Agrícolas",
    contact: "Pedro Díaz",
    phone: "555-678-9012",
    email: "pedro@herramientas.com",
    address: "Calle Industrial 567, Ciudad",
    category: "Equipos",
    status: "Activo",
    lastPurchase: "2023-02-20",
    notes: "Proveedor de herramientas y repuestos",
  },
  {
    id: "PROV008",
    name: "Semillas Certificadas",
    contact: "Laura Torres",
    phone: "555-789-0123",
    email: "laura@semillas.com",
    address: "Av. Campo 890, Ciudad",
    category: "Insumos",
    status: "Inactivo",
    lastPurchase: "2022-10-05",
    notes: "Proveedor de semillas para pastos",
  },
]

export function SuppliersManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)
  const [activeFilters, setActiveFilters] = useState<{
    category: string[]
    status: string[]
  }>({
    category: [],
    status: [],
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
  let filteredSuppliers = [...suppliers]

  // Aplicar filtros de búsqueda
  if (searchTerm) {
    filteredSuppliers = filteredSuppliers.filter(
      (supplier) =>
        supplier.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Aplicar filtros de dropdown
  if (activeFilters.category.length > 0) {
    filteredSuppliers = filteredSuppliers.filter((supplier) => activeFilters.category.includes(supplier.category))
  }

  if (activeFilters.status.length > 0) {
    filteredSuppliers = filteredSuppliers.filter((supplier) => activeFilters.status.includes(supplier.status))
  }

  // Aplicar ordenamiento
  if (sortConfig !== null) {
    filteredSuppliers.sort((a, b) => {
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
  const uniqueCategories = [...new Set(suppliers.map((supplier) => supplier.category))]
  const uniqueStatuses = [...new Set(suppliers.map((supplier) => supplier.status))]

  // Función para manejar cambios en los filtros
  const handleFilterChange = (type: "category" | "status", value: string) => {
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
      status: [],
    })
    setSearchTerm("")
  }

  const [selectedSupplier, setSelectedSupplier] = useState<(typeof suppliers)[0] | null>(null)
  // Agregar un nuevo estado para controlar el diálogo de edición
  const [editOpen, setEditOpen] = useState(false)

  // Agregar esta línea después de la declaración de selectedSupplier
  const [supplierToEdit, setSupplierToEdit] = useState<(typeof suppliers)[0] | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Proveedores</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Proveedor</DialogTitle>
              <DialogDescription>
                Ingrese los datos del nuevo proveedor. Haga clic en guardar cuando termine.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="supplier-id">ID</Label>
                  <Input id="supplier-id" placeholder="PROV000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier-name">Nombre de la Empresa</Label>
                  <Input id="supplier-name" placeholder="Nombre de la empresa" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contact-name">Persona de Contacto</Label>
                  <Input id="contact-name" placeholder="Nombre del contacto" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alimentos">Alimentos</SelectItem>
                      <SelectItem value="medicamentos">Medicamentos</SelectItem>
                      <SelectItem value="equipos">Equipos</SelectItem>
                      <SelectItem value="suplementos">Suplementos</SelectItem>
                      <SelectItem value="servicios">Servicios</SelectItem>
                      <SelectItem value="insumos">Insumos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="Número de teléfono" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" placeholder="correo@ejemplo.com" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" placeholder="Dirección completa" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Estado</Label>
                <Select defaultValue="activo">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
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

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Listado de Proveedores</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por ID, nombre o contacto..."
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
                    {(activeFilters.category.length > 0 || activeFilters.status.length > 0) && (
                      <Badge variant="secondary" className="ml-2 rounded-full">
                        {activeFilters.category.length + activeFilters.status.length}
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
                  <DropdownMenuLabel className="font-normal">Estado</DropdownMenuLabel>
                  {uniqueStatuses.map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={activeFilters.status.includes(status)}
                      onCheckedChange={() => handleFilterChange("status", status)}
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
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => requestSort("name")}>
                      <span>Empresa</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => requestSort("contact")}>
                      <span>Contacto</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => requestSort("category")}>
                      <span>Categoría</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => requestSort("phone")}>
                      <span>Teléfono</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => requestSort("status")}>
                      <span>Estado</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No se encontraron registros que coincidan con los criterios de búsqueda.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.id}</TableCell>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.contact}</TableCell>
                      <TableCell className="hidden md:table-cell">{supplier.category}</TableCell>
                      <TableCell className="hidden md:table-cell">{supplier.phone}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant={supplier.status === "Activo" ? "default" : "secondary"}>
                          {supplier.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSupplier(supplier)
                              setDetailsOpen(true)
                            }}
                          >
                            Detalles
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSupplierToEdit(supplier)
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
            Mostrando {filteredSuppliers.length} de {suppliers.length} registros
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

      {/* Diálogo de detalles */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles del Proveedor</DialogTitle>
            <DialogDescription>Información detallada del proveedor seleccionado.</DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">ID</h3>
                  <p>{selectedSupplier.id}</p>
                </div>
                <div>
                  <h3 className="font-medium">Empresa</h3>
                  <p>{selectedSupplier.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Contacto</h3>
                  <p>{selectedSupplier.contact}</p>
                </div>
                <div>
                  <h3 className="font-medium">Categoría</h3>
                  <p>{selectedSupplier.category}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Teléfono
                </h3>
                <p>{selectedSupplier.phone}</p>
              </div>
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Correo Electrónico
                </h3>
                <p>{selectedSupplier.email}</p>
              </div>
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Dirección
                </h3>
                <p>{selectedSupplier.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Estado</h3>
                  <Badge variant={selectedSupplier.status === "Activo" ? "default" : "secondary"}>
                    {selectedSupplier.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-medium">Última Compra</h3>
                  <p>{selectedSupplier.lastPurchase}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium">Notas</h3>
                <p>{selectedSupplier.notes}</p>
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
      {/* Diálogo de edición */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Proveedor</DialogTitle>
            <DialogDescription>
              Modifique los datos del proveedor. Haga clic en guardar cuando termine.
            </DialogDescription>
          </DialogHeader>
          {supplierToEdit && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-supplier-id">ID</Label>
                  <Input id="edit-supplier-id" defaultValue={supplierToEdit.id} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-supplier-name">Nombre de la Empresa</Label>
                  <Input id="edit-supplier-name" defaultValue={supplierToEdit.name} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-contact-name">Persona de Contacto</Label>
                  <Input id="edit-contact-name" defaultValue={supplierToEdit.contact} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Categoría</Label>
                  <Select defaultValue={supplierToEdit.category.toLowerCase()}>
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alimentos">Alimentos</SelectItem>
                      <SelectItem value="medicamentos">Medicamentos</SelectItem>
                      <SelectItem value="equipos">Equipos</SelectItem>
                      <SelectItem value="suplementos">Suplementos</SelectItem>
                      <SelectItem value="servicios">Servicios</SelectItem>
                      <SelectItem value="insumos">Insumos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Teléfono</Label>
                  <Input id="edit-phone" defaultValue={supplierToEdit.phone} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Correo Electrónico</Label>
                  <Input id="edit-email" type="email" defaultValue={supplierToEdit.email} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Dirección</Label>
                <Input id="edit-address" defaultValue={supplierToEdit.address} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Estado</Label>
                <Select defaultValue={supplierToEdit.status.toLowerCase()}>
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Notas</Label>
                <Input id="edit-notes" defaultValue={supplierToEdit.notes} />
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
                alert("Proveedor actualizado correctamente")
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

