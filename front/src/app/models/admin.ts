
export interface Admin {
  id: number
  first_name: string
  last_name: string
  email: string
  password: string
  role:'admin' | 'superadmin'
  company_id: number
}