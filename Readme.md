# Deno Validator

# Abilities

- attach any Plugin for newer validation rules
- parse data
- cache schema (memoizer)
- validate nested object
- push validation errors to a global error array
- receive regex for string validation
- set custom error messages
- support optional and required fields
- strict mode for removing additional fields
- alias definition for example create a rule named username with defined string rules

> Create an Interface for validator object so we can use it to provide extra validators as easy as F

## Data Structure to be validated

- boolean
  - accepted (only true pass)
- string
  - min:10
  - Max:100
  - regex: \ir\
  - startsWith:IR\*\*\*
- number
  - equal
  - between
  - digits
  - greater than
  - less than
- date
  - time format
  - current date
- file
  - dimension (X future)
  - size
- array
  - in: [ 'first', 'second' ]
- request
  - ip address
- set
  - cast to set
