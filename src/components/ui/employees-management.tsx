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
import { ArrowUpDown, Calendar, Edit, FileDown, Filter, Mail, MapPin, Phone, Plus, Search, Trash2 } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Datos de ejemplo
const employees = [
  {
    id: "EMP001",
    firstName: "Juan",
    lastName: "Pérez",
    position: "Encargado de Producción",
    department: "Producción",
    email: "juan.perez@caprisystem.com",
    phone: "555-123-4567",
    address: "Calle Principal 123, Ciudad",
    hireDate: "2020-05-15",
    status: "Activo",
    permissions: ["Inventario", "Producción", "Ventas"],
  },
  {
    id: "EMP002",
    firstName: "María",
    lastName: "Gómez",
    position: "Veterinaria",
    department: "Salud Animal",
    email: "maria.gomez@caprisystem.com",
    phone: "555-234-5678",
    address: "Av. Central 456, Ciudad",
    hireDate: "2021-03-10",
    status: "Activo",
    permissions: ["Registro Caprino", "Salud Animal"],
  },
  {
    id: "EMP003",
    firstName: "Carlos",
    lastName: "Rodríguez",
    position: "Encargado de Ventas",
    department: "Ventas",
    email: "carlos.rodriguez@caprisystem.com",
    phone: "555-345-6789",
    address: "Calle 10 #45, Ciudad",
    hireDate: "2019-11-20",
    status: "Activo",
    permissions: ["Ventas", "Clientes"],
  },
  {
    id: "EMP004",
    firstName: "Ana",
    lastName: "Martínez",
    position: "Asistente Administrativo",
    department: "Administración",
    email: "ana.martinez@caprisystem.com",
    phone: "555-456-7890",
    address: "Av. Sur 789, Ciudad",
    hireDate: "2022-01-15",
    status: "Activo",
    permissions: ["Inventario", "Proveedores", "Reportes"],
  },
  {
    id: "EMP005",
    firstName: "Roberto",
    lastName: "Sánchez",
    position: "Encargado de Almacén",
    department: "Inventario",
    email: "roberto.sanchez@caprisystem.com",
    phone: "555-567-8901",
    address: "Camino Rural 234, Ciudad",
    hireDate: "2020-08-05",
    status: "Activo",
    permissions: ["Inventario"],
  },
  {
    id: "EMP006",
    firstName: "Laura",
    lastName: "Torres",
    position: "Asistente de Producción",
    department: "Producción",
    email: "laura.torres@caprisystem.com",
    phone: "555-678-9012",
    address: "Calle Industrial 567, Ciudad",
    hireDate: "2021-06-10",
    status: "Inactivo",
    permissions: ["Producción"],
  },
  {
    id: "EMP007",
    firstName: "Pedro",
    lastName: "Díaz",
    position: "Gerente General",
    department: "Dirección",
    email: "pedro.diaz@caprisystem.com",
    phone: "555-789-0123",
    address: "Av. Principal 890, Ciudad",
    hireDate: "2018-03-01",
    status: "Activo",
    permissions: ["Administración", "Reportes", "Configuración"],
  },
  {
    id: "EMP008",
    firstName: "Sofía",
    lastName: "López",
    position: "Contadora",
    department: "Finanzas",
    email: "sofia.lopez@caprisystem.com",
    phone: "555-890-1234",
    address: "Calle Comercial 123, Ciudad",
    hireDate: "2019-07-15",
    status: "Activo",
    permissions: ["Finanzas", "Reportes"],
  },
]

export function EmployeesManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)
  const [activeFilters, setActiveFilters] = useState<{
    department: string[]
    status: string[]
  }>({
    department: [],
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
  let filteredEmployees = [...employees]

  // Aplicar filtros de búsqueda
  if (searchTerm) {
    filteredEmployees = filteredEmployees.filter(
      (employee) =>
        employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Aplicar filtros de dropdown
  if (activeFilters.department.length > 0) {
    filteredEmployees = filteredEmployees.filter((employee) => activeFilters.department.includes(employee.department))
  }

  if (activeFilters.status.length > 0) {
    filteredEmployees = filteredEmployees.filter((employee) => activeFilters.status.includes(employee.status))
  }

  // Aplicar ordenamiento
  if (sortConfig !== null) {
    filteredEmployees.sort((a, b) => {
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
  const uniqueDepartments = [...new Set(employees.map((employee) => employee.department))]
  const uniqueStatuses = [...new Set(employees.map((employee) => employee.status))]

  // Función para manejar cambios en los filtros
  const handleFilterChange = (type: "department" | "status", value: string) => {
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
      department: [],
      status: [],
    })
    setSearchTerm("")
  }

  const [selectedEmployee, setSelectedEmployee] = useState<(typeof employees)[0] | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  // Agregar un nuevo estado para controlar el diálogo de edición
  const [editOpen, setEditOpen] = useState(false)

  // Agregar esta línea después de la declaración de selectedEmployee
  const [employeeToEdit, setEmployeeToEdit] = useState<(typeof employees)[0] | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Empleados</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Empleado</DialogTitle>
              <DialogDescription>
                Ingrese los datos del nuevo empleado. Haga clic en guardar cuando termine.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="employee-id">ID</Label>
                  <Input id="employee-id" placeholder="EMP000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hire-date">Fecha de Contratación</Label>
                  <Input id="hire-date" type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">Nombre</Label>
                  <Input id="first-name" placeholder="Nombre" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Apellido</Label>
                  <Input id="last-name" placeholder="Apellido" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input id="position" placeholder="Cargo" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="produccion">Producción</SelectItem>
                      <SelectItem value="salud-animal">Salud Animal</SelectItem>
                      <SelectItem value="ventas">Ventas</SelectItem>
                      <SelectItem value="administracion">Administración</SelectItem>
                      <SelectItem value="inventario">Inventario</SelectItem>
                      <SelectItem value="direccion">Dirección</SelectItem>
                      <SelectItem value="finanzas">Finanzas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" placeholder="correo@ejemplo.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="Número de teléfono" />
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
                <Label>Permisos</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="perm-inventory" className="rounded border-gray-300" />
                    <Label htmlFor="perm-inventory" className="font-normal">
                      Inventario
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="perm-production" className="rounded border-gray-300" />
                    <Label htmlFor="perm-production" className="font-normal">
                      Producción
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="perm-sales" className="rounded border-gray-300" />
                    <Label htmlFor="perm-sales" className="font-normal">
                      Ventas
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="perm-reports" className="rounded border-gray-300" />
                    <Label htmlFor="perm-reports" className="font-normal">
                      Reportes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="perm-goats" className="rounded border-gray-300" />
                    <Label htmlFor="perm-goats" className="font-normal">
                      Registro Caprino
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="perm-suppliers" className="rounded border-gray-300" />
                    <Label htmlFor="perm-suppliers" className="font-normal">
                      Proveedores
                    </Label>
                  </div>
                </div>
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
            <CardTitle>Listado de Empleados</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por ID, nombre, cargo..."
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
                    {(activeFilters.department.length > 0 || activeFilters.status.length > 0) && (
                      <Badge variant="secondary" className="ml-2 rounded-full">
                        {activeFilters.department.length + activeFilters.status.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuLabel className="font-normal">Departamento</DropdownMenuLabel>
                  {uniqueDepartments.map((department) => (
                    <DropdownMenuCheckboxItem
                      key={department}
                      checked={activeFilters.department.includes(department)}
                      onCheckedChange={() => handleFilterChange("department", department)}
                    >
                      {department}
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
                    <div
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={() => requestSort("firstName")}
                    >
                      <span>Nombre</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => requestSort("lastName")}>
                      <span>Apellido</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => requestSort("position")}>
                      <span>Cargo</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={() => requestSort("department")}
                    >
                      <span>Departamento</span>
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
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No se encontraron registros que coincidan con los criterios de búsqueda.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.id}</TableCell>
                      <TableCell>{employee.firstName}</TableCell>
                      <TableCell>{employee.lastName}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant={employee.status === "Activo" ? "default" : "secondary"}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEmployee(employee)
                              setDetailsOpen(true)
                            }}
                          >
                            Detalles
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEmployeeToEdit(employee)
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
            Mostrando {filteredEmployees.length} de {employees.length} registros
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
            <DialogTitle>Detalles del Empleado</DialogTitle>
            <DialogDescription>Información detallada del empleado seleccionado.</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src="/placeholder.svg?height=64&width=64"
                    alt={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                  />
                  <AvatarFallback>
                    {selectedEmployee.firstName[0]}
                    {selectedEmployee.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedEmployee.position}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">ID</h3>
                  <p>{selectedEmployee.id}</p>
                </div>
                <div>
                  <h3 className="font-medium">Departamento</h3>
                  <p>{selectedEmployee.department}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Correo Electrónico
                </h3>
                <p>{selectedEmployee.email}</p>
              </div>

              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Teléfono
                </h3>
                <p>{selectedEmployee.phone}</p>
              </div>

              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Dirección
                </h3>
                <p>{selectedEmployee.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Fecha de Contratación
                  </h3>
                  <p>{selectedEmployee.hireDate}</p>
                </div>
                <div>
                  <h3 className="font-medium">Estado</h3>
                  <Badge variant={selectedEmployee.status === "Activo" ? "default" : "secondary"}>
                    {selectedEmployee.status}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Permisos</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedEmployee.permissions.map((permission) => (
                    <Badge key={permission} variant="outline">
                      {permission}
                    </Badge>
                  ))}
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
      {/* Diálogo de edición */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Empleado</DialogTitle>
            <DialogDescription>
              Modifique los datos del empleado. Haga clic en guardar cuando termine.
            </DialogDescription>
          </DialogHeader>
          {employeeToEdit && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-employee-id">ID</Label>
                  <Input id="edit-employee-id" defaultValue={employeeToEdit.id} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-hire-date">Fecha de Contratación</Label>
                  <Input id="edit-hire-date" type="date" defaultValue={employeeToEdit.hireDate} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-first-name">Nombre</Label>
                  <Input id="edit-first-name" defaultValue={employeeToEdit.firstName} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-last-name">Apellido</Label>
                  <Input id="edit-last-name" defaultValue={employeeToEdit.lastName} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-position">Cargo</Label>
                  <Input id="edit-position" defaultValue={employeeToEdit.position} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-department">Departamento</Label>
                  <Select defaultValue={employeeToEdit.department.toLowerCase().replace(/\s+/g, "-")}>
                    <SelectTrigger id="edit-department">
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="produccion">Producción</SelectItem>
                      <SelectItem value="salud-animal">Salud Animal</SelectItem>
                      <SelectItem value="ventas">Ventas</SelectItem>
                      <SelectItem value="administracion">Administración</SelectItem>
                      <SelectItem value="inventario">Inventario</SelectItem>
                      <SelectItem value="direccion">Dirección</SelectItem>
                      <SelectItem value="finanzas">Finanzas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Correo Electrónico</Label>
                  <Input id="edit-email" type="email" defaultValue={employeeToEdit.email} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Teléfono</Label>
                  <Input id="edit-phone" defaultValue={employeeToEdit.phone} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Dirección</Label>
                <Input id="edit-address" defaultValue={employeeToEdit.address} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Estado</Label>
                <Select defaultValue={employeeToEdit.status.toLowerCase()}>
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
                <Label>Permisos</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Inventario", "Producción", "Ventas", "Reportes", "Registro Caprino", "Proveedores"].map(
                    (permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`edit-perm-${permission.toLowerCase().replace(/\s+/g, "-")}`}
                          className="rounded border-gray-300"
                          defaultChecked={employeeToEdit.permissions.includes(permission)}
                        />
                        <Label
                          htmlFor={`edit-perm-${permission.toLowerCase().replace(/\s+/g, "-")}`}
                          className="font-normal"
                        >
                          {permission}
                        </Label>
                      </div>
                    ),
                  )}
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
                alert("Empleado actualizado correctamente")
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

