import type { MeUser } from "@/types/auth"
import type { Supplier } from "@/types/company"

export type ProfileApiResponse = {
  success: boolean
  message?: string
  data: {
    user: MeUser
    company?: Supplier
  }
}

export type UpdateProfileInput = {
  name: string
  email: string
}

export type UpdateCompanyInput = {
  name?: string
  email?: string
  phone?: string
  address?: string
  address_line?: string | null
  latitude?: number | null
  longitude?: number | null
  region_id?: number | null
  tax_id?: string | null
  registration_number?: string | null
}

export type ChangePasswordInput = {
  current_password: string
  password: string
  password_confirmation: string
}

