export interface Member {
  name: string
  uuid: string
}

export interface Room {
  members: Member[]
  reveal: boolean
  title: string
  votes: Map<string, number>
}
