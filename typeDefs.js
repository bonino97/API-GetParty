const { gql } = require('apollo-server');

module.exports = gql`
  scalar Date

  type User {
    _id: ID
    email: String
    password: String
    name: String
    userName: String
    profileUrl: String
    instagramUrl: String
    role: String
    token: String
    authBy: String
    picture: String
    isActive: Boolean
    termsAndConditions: Boolean
    createdAt: String
    updatedAt: String
  }

  type Pin {
    _id: ID

    title: String
    content: String
    phone: String
    image: String
    category: String
    startDate: Date
    endDate: Date

    location: Location

    availableTickets: Int
    priceOfTicket: Int
    takeFees: Boolean

    isPeriodic: Boolean
    isPrivate: Boolean
    entryRequirements: String
    tags: [String]
    instagram: String
    twitter: String
    facebook: String

    slug: String

    latitude: Float
    longitude: Float
    createdAt: String

    author: User
    staff: [User]
    attendees: [User]
    followers: [User]
    comments: [Comments]
  }

  input CreatePinInput {
    title: String!
    content: String
    image: String
    category: String
    startDate: Date
    endDate: Date

    phone: String
    location: LocationInput

    availableTickets: Int
    priceOfTicket: Int
    takeFees: Boolean

    isPeriodic: Boolean
    isPrivate: Boolean

    entryRequirements: String
    tags: [String]
    instagram: String
    twitter: String
    facebook: String

    latitude: Float
    longitude: Float
  }

  input LocationInput {
    address: String
    city: String
    state: String
    zipCode: String
    country: String
  }

  input RegisterInput {
    email: String
    password: String
    name: String
    termsAndConditions: Boolean
  }

  input LoginInput {
    email: String
    password: String
  }

  input ForgotPasswordInput {
    email: String
  }

  input ResetPasswordInput {
    code: Float
  }

  input ConfirmAccountInput {
    token: String
  }

  type Location {
    address: String
    city: String
    state: String
    zipCode: String
    country: String
  }

  type Comments {
    text: String
    author: User
    createdAt: String
  }

  type Query {
    me: User
    getPins: [Pin!]!
    getPin: Pin!
  }

  type Mutation {
    register(input: RegisterInput!): User
    login(input: LoginInput!): User
    confirmAccount(input: ConfirmAccountInput!): User
    forgotPassword(input: ForgotPasswordInput!): User
    resetPassword(input: ResetPasswordInput!): User
    createPin(input: CreatePinInput!): Pin
    deletePin(pinId: ID!): Pin
    createComment(pinId: ID!, text: String!): Pin
  }

  type Subscription {
    pinAdded: Pin
    pinDeleted: Pin
    pinUpdated: Pin
  }
`;
