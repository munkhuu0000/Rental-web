export const RENTAL_DETAIL_QUERY = `
  query RentalDetailData {
    companies {
      id
      name
      registerNumber
      phone
      email
    }
    materials {
      id
      name
      unit
      defaultPrice
    }
    masterContracts {
      id
      renterCompany {
        id
        name
        phone
        email
      }
    }
    rentalUsages {
      id
      contractId
      materialId
      material {
        id
        name
        unit
        defaultPrice
      }
      movementType
      movementDate
      quantity
      unitPrice
      usageDays
      notes
    }
  }
`;
