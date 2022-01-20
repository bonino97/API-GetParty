const { gql } = require('apollo-server');

module.exports = gql`
  scalar Date

  type User {
    _id: ID
    name: String
    email: String
    picture: String
    createdAt: String
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
