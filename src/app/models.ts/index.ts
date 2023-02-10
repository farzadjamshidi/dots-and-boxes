export class Dot {
  id!: number
  order!: number
  top!: Dot | null
  bottom!: Dot | null
  left!: Dot | null
  right!: Dot | null
}

export class Player {
  id!: number
  name!: string
  color!: string
  team!: Team
}

export class Team {
  id!: number
  name!: string
  color!: string
  players!: Player[]
}

export class Line {
  id!: number
  order!: number
  dot1!: Dot
  dot2!: Dot
  vertical!: boolean
  horizontal!: boolean
  squares!: Square[]
}

export class DrawedLine extends Line {
  player!: Player
}

export class Square {
  id!: number
  order!: number
  lines!: Line[]
  dots!: Dot[]
}

export class DrawedSquare extends Square {
  team!: Team
}
