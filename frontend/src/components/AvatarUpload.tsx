'use client'

import { useState, useCallback, useRef } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { Button } from './ui/Button'
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from './ui/Modal'
import { Upload, X } from 'lucide-react'
import { uploadApi } from '@/lib/upload'
import { useToast } from './ToastProvider'

interface AvatarUploadProps {
    currentAvatar?: string | null
    onAvatarUpdate: (newAvatarUrl: string) => void
}

export function AvatarUpload({ currentAvatar, onAvatarUpdate }: AvatarUploadProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { showToast } = useToast()

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showToast({ message: 'Пожалуйста, выберите изображение', variant: 'error' })
            return
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast({ message: 'Файл слишком большой (макс. 5MB)', variant: 'error' })
            return
        }

        // Read file
        const reader = new FileReader()
        reader.onload = () => {
            setImageSrc(reader.result as string)
            setIsOpen(true)
        }
        reader.readAsDataURL(file)
    }

    const createCroppedImage = async (): Promise<Blob> => {
        if (!imageSrc || !croppedAreaPixels) {
            throw new Error('No image to crop')
        }

        const image = new Image()
        image.src = imageSrc

        await new Promise((resolve) => {
            image.onload = resolve
        })

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            throw new Error('Failed to get canvas context')
        }

        canvas.width = croppedAreaPixels.width
        canvas.height = croppedAreaPixels.height

        ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
        )

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob)
                }
            }, 'image/jpeg', 0.95)
        })
    }

    const handleUpload = async () => {
        try {
            setUploading(true)

            // Create cropped image
            const croppedBlob = await createCroppedImage()
            const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' })

            // Upload to server
            const response = await uploadApi.uploadAvatar(file)

            // Update avatar
            onAvatarUpdate(response.avatarUrl)
            showToast({ message: 'Аватар успешно обновлен!', variant: 'success' })

            // Close modal
            setIsOpen(false)
            setImageSrc(null)
            setCrop({ x: 0, y: 0 })
            setZoom(1)
        } catch (error: any) {
            console.error('Upload error:', error)
            showToast({ message: error.response?.data?.message || 'Ошибка загрузки аватара', variant: 'error' })
        } finally {
            setUploading(false)
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        setImageSrc(null)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
            >
                <Upload className="w-4 h-4 mr-2" />
                Изменить аватар
            </Button>

            <Modal open={isOpen} onClose={handleClose} size="lg">
                <ModalHeader>
                    <ModalTitle>Загрузить аватар</ModalTitle>
                </ModalHeader>

                <ModalContent>
                    {imageSrc && (
                        <div className="space-y-4">
                            {/* Cropper */}
                            <div className="relative w-full h-96 bg-neutral-900 rounded-lg overflow-hidden">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    cropShape="round"
                                    showGrid={false}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>

                            {/* Zoom slider */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">
                                    Масштаб
                                </label>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    )}
                </ModalContent>

                <ModalFooter>
                    <Button variant="ghost" onClick={handleClose} disabled={uploading}>
                        Отмена
                    </Button>
                    <Button onClick={handleUpload} disabled={uploading}>
                        {uploading ? 'Загрузка...' : 'Сохранить'}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
