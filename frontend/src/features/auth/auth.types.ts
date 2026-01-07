export type SignInInput = {
  email: string
  password: string
}

export type SignUpInput = {
  email: string
  password: string
}

export type AuthUser = {
  id: string
  email: string
}

export type SignInResult = {
  signIn: {
    accessToken: string
    user: AuthUser
  }
}

export type SignUpResult = {
  signUp: {
    accessToken: string
    user: AuthUser
  }
}

export type SignInVariables = {
  input: SignInInput
}

export type SignUpVariables = {
  input: SignUpInput
}
