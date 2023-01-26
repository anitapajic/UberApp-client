
export interface Registration{
    name: string | null | undefined,
    surname: string | null | undefined,
    username: string | null | undefined,
    password: string | null | undefined,
    confirmPassword: string | null | undefined,
    dateOfBirth: string | null | undefined,
    telephoneNumber: string | null | undefined,
    address:  string | null | undefined
}

export interface DriverRegistration{
    name: string | null | undefined,
    surname: string | null | undefined,
    username: string | null | undefined,
    password: string | null | undefined,
    confirmPassword: string | null | undefined,
    dateOfBirth: string | null | undefined,
    telephoneNumber: string | null | undefined,
    address:  string | null | undefined,
    vehicle: string | null | undefined
}