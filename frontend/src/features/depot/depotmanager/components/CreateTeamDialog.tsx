import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '../../components/input'
import { Button } from '../../components/button'
import { useCreateDepotTeam } from '../../hooks/useCreateDepotTeam'

interface CreateDepotTeamDialogProps {
  open: boolean
  onClose: () => void
}

export default function CreateDepotTeamDialog({ open, onClose }: CreateDepotTeamDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateDepotTeamSchema>({
    resolver: zodResolver(createDepotTeamSchema),
  })

  const { mutate: createDepotTeam, isLoading } = useCreateDepotTeam()

  const onSubmit = (data: CreateDepotTeamSchema) => {
    createDepotTeam(data, {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nuevo equipo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input placeholder="Nombre del equipo" {...register('teamName')} />
            {errors.teamName && <p className="text-sm text-red-500">{errors.teamName.message}</p>}
          </div>
          <div>
            <Input placeholder="Descripción (opcional)" {...register('teamDescription')} />
            {errors.teamDescription && <p className="text-sm text-red-500">{errors.teamDescription.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear equipo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
