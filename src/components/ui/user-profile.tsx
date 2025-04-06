"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User, Mail, Phone, MapPin, Calendar, Camera, FileText, ShoppingBag, BarChart, Bell } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useToast } from "../../hooks/use-toast"

// Datos de ejemplo para el usuario
const userData = {
  id: "USR001",
  firstName: "Pedro",
  lastName: "Agropecuario",
  email: "pedro@caprisystem.com",
  phone: "555-123-4567",
  address: "Calle Principal 123, Ciudad",
  role: "Administrador",
  joinDate: "2020-05-15",
  lastLogin: "2023-04-15 08:30",
  avatar: "/placeholder.svg?height=128&width=128",
}

// Datos de ejemplo para actividad reciente
const recentActivity = [
  { id: 1, action: "Registro de nacimiento", entity: "CAP009", date: "2023-04-14 14:30" },
  { id: 2, action: "Actualización de inventario", entity: "INV005", date: "2023-04-13 10:15" },
  { id: 3, action: "Registro de venta", entity: "VEN012", date: "2023-04-12 16:45" },
  { id: 4, action: "Actualización de empleado", entity: "EMP003", date: "2023-04-10 09:20" },
  { id: 5, action: "Registro de vacunación", entity: "CAP005", date: "2023-04-08 11:30" },
]

// Datos de ejemplo para compras recientes
const recentPurchases = [
  { id: "PUR001", date: "2023-04-10", supplier: "Alimentos Naturales S.A.", items: 3, total: 450 },
  { id: "PUR002", date: "2023-03-28", supplier: "Medicamentos Veterinarios", items: 5, total: 320 },
  { id: "PUR003", date: "2023-03-15", supplier: "Forrajes del Valle", items: 2, total: 180 },
  { id: "PUR004", date: "2023-03-05", supplier: "Suplementos Minerales", items: 4, total: 275 },
  { id: "PUR005", date: "2023-02-20", supplier: "Equipos Agrícolas", items: 1, total: 1200 },
]

// Datos de ejemplo para estadísticas
const userStats = {
  registrosCreados: 128,
  ventasRealizadas: 45,
  comprasRealizadas: 32,
  reportesGenerados: 18,
  diasActivo: 245,
}

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone,
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = () => {
    // Aquí iría la lógica para guardar los cambios del perfil
    setIsEditing(false)
    toast({
      title: "Perfil actualizado",
      description: "Tu información personal ha sido actualizada correctamente.",
    })
  }

  const handleSavePassword = () => {
    // Aquí iría la lógica para cambiar la contraseña
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      })
      return
    }

    setIsChangingPassword(false)
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido actualizada correctamente.",
    })
  }

  const handleUploadAvatar = () => {
    // Aquí iría la lógica para subir una nueva foto de perfil
    toast({
      title: "Foto actualizada",
      description: "Tu foto de perfil ha sido actualizada correctamente.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Mi Cuenta</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel lateral con información básica */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={userData.avatar} alt={`${userData.firstName} ${userData.lastName}`} />
                    <AvatarFallback className="text-3xl">
                      {userData.firstName[0]}
                      {userData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-background"
                    onClick={handleUploadAvatar}
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Cambiar foto</span>
                  </Button>
                </div>
                <CardTitle className="text-xl">
                  {userData.firstName} {userData.lastName}
                </CardTitle>
                <CardDescription>{userData.email}</CardDescription>
                <Badge className="mt-2">{userData.role}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{userData.address}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Miembro desde: {userData.joinDate}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Último acceso: {userData.lastLogin}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                Editar Perfil
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Usuario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    Registros Creados
                  </span>
                  <Badge variant="secondary">{userStats.registrosCreados}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2 text-muted-foreground" />
                    Ventas Realizadas
                  </span>
                  <Badge variant="secondary">{userStats.ventasRealizadas}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2 text-muted-foreground" />
                    Compras Realizadas
                  </span>
                  <Badge variant="secondary">{userStats.comprasRealizadas}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <BarChart className="h-4 w-4 mr-2 text-muted-foreground" />
                    Reportes Generados
                  </span>
                  <Badge variant="secondary">{userStats.reportesGenerados}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    Días Activo
                  </span>
                  <Badge variant="secondary">{userStats.diasActivo}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal con pestañas */}
        <div className="md:col-span-2">
          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="activity">Actividad</TabsTrigger>
              <TabsTrigger value="purchases">Compras</TabsTrigger>
              <TabsTrigger value="security">Seguridad</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>

            {/* Pestaña de Actividad Reciente */}
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Historial de tus acciones recientes en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Acción</TableHead>
                        <TableHead>Entidad</TableHead>
                        <TableHead>Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentActivity.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">{activity.action}</TableCell>
                          <TableCell>{activity.entity}</TableCell>
                          <TableCell>{activity.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Ver Más Antiguas</Button>
                  <Button variant="outline">Exportar Historial</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumen de Actividad</CardTitle>
                  <CardDescription>Resumen de tu actividad en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <FileText className="h-8 w-8 mb-2 text-[#6b7c45]" />
                      <span className="text-2xl font-bold">{userStats.registrosCreados}</span>
                      <span className="text-sm text-muted-foreground">Registros</span>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <ShoppingBag className="h-8 w-8 mb-2 text-[#6b7c45]" />
                      <span className="text-2xl font-bold">
                        {userStats.ventasRealizadas + userStats.comprasRealizadas}
                      </span>
                      <span className="text-sm text-muted-foreground">Transacciones</span>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <BarChart className="h-8 w-8 mb-2 text-[#6b7c45]" />
                      <span className="text-2xl font-bold">{userStats.reportesGenerados}</span>
                      <span className="text-sm text-muted-foreground">Reportes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pestaña de Compras */}
            <TabsContent value="purchases" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Compras Recientes</CardTitle>
                  <CardDescription>Historial de tus compras recientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead>Artículos</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentPurchases.map((purchase) => (
                        <TableRow key={purchase.id}>
                          <TableCell className="font-medium">{purchase.id}</TableCell>
                          <TableCell>{purchase.date}</TableCell>
                          <TableCell>{purchase.supplier}</TableCell>
                          <TableCell>{purchase.items}</TableCell>
                          <TableCell>${purchase.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Ver Historial Completo</Button>
                  <Button variant="outline">Exportar a PDF</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumen de Compras</CardTitle>
                  <CardDescription>Resumen de tus compras por categoría</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Alimentos</span>
                        <span>$1,250</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-[#6b7c45] h-2 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Medicamentos</span>
                        <span>$850</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-[#6b7c45] h-2 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Equipos</span>
                        <span>$1,500</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-[#6b7c45] h-2 rounded-full" style={{ width: "55%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Suplementos</span>
                        <span>$450</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-[#6b7c45] h-2 rounded-full" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Otros</span>
                        <span>$350</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-[#6b7c45] h-2 rounded-full" style={{ width: "10%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full flex justify-between">
                    <span className="font-medium">Total Gastado:</span>
                    <span className="font-bold">$4,400</span>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Pestaña de Seguridad */}
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cambiar Correo Electrónico</CardTitle>
                  <CardDescription>
                    Actualiza tu correo electrónico para recibir un nuevo enlace de verificación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isChangingPassword ? (
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="currentEmail">Correo Electrónico Actual</Label>
                        <Input id="currentEmail" name="currentEmail" type="email" value={userData.email} disabled />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="newEmail">Nuevo Correo Electrónico</Label>
                        <Input
                          id="newEmail"
                          name="newEmail"
                          type="email"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="nuevo@correo.com"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Correo Electrónico</p>
                          <p className="text-sm text-muted-foreground">{userData.email}</p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                        Cambiar
                      </Button>
                    </div>
                  )}
                </CardContent>
                {isChangingPassword && (
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsChangingPassword(false)
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        })
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Correo enviado",
                          description: "Se ha enviado un enlace de verificación a tu nuevo correo electrónico.",
                        })
                        setIsChangingPassword(false)
                      }}
                    >
                      Enviar Enlace de Verificación
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            {/* Pestaña de Configuración */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Actualiza tu información personal</CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="firstName">Nombre</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="lastName">Apellido</Label>
                          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">Nombre</Label>
                          <p>{userData.firstName}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Apellido</Label>
                          <p>{userData.lastName}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Correo Electrónico</Label>
                        <p>{userData.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Para cambiar el correo, ve a la pestaña de Seguridad
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Teléfono</Label>
                        <p>{userData.phone}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">ID de Usuario</Label>
                        <p>{userData.id}</p>
                        <p className="text-xs text-muted-foreground mt-1">Este código no se puede modificar</p>
                      </div>
                      <Button variant="outline" className="mt-2" onClick={() => setIsEditing(true)}>
                        Editar información
                      </Button>
                    </div>
                  )}
                </CardContent>
                {isEditing && (
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          firstName: userData.firstName,
                          lastName: userData.lastName,
                          phone: userData.phone,
                        })
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveProfile}>Guardar Cambios</Button>
                  </CardFooter>
                )}
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferencias de Notificaciones</CardTitle>
                  <CardDescription>Configura cómo quieres recibir notificaciones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Notificaciones por correo</p>
                        <p className="text-sm text-muted-foreground">Recibe notificaciones por correo electrónico</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Alertas del sistema</p>
                        <p className="text-sm text-muted-foreground">Recibe alertas importantes del sistema</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Reportes semanales</p>
                        <p className="text-sm text-muted-foreground">Recibe resúmenes semanales de actividad</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

