import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum ActStatus {
  Draft = 'DRAFT',
  Ready = 'READY',
  Signed = 'SIGNED',
  Void = 'VOID'
}

export type Company = {
  __typename?: 'Company';
  address?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  registerNumber: Scalars['String']['output'];
  role: CompanyRole;
  updatedAt: Scalars['String']['output'];
};

export enum CompanyRole {
  Both = 'BOTH',
  Owner = 'OWNER',
  Renter = 'RENTER'
}

export type ContractRate = {
  __typename?: 'ContractRate';
  contractId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  material: Material;
  materialId: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  unit: UnitType;
  unitPrice: Scalars['Float']['output'];
};

export enum ContractStatus {
  Active = 'ACTIVE',
  Draft = 'DRAFT',
  Expired = 'EXPIRED',
  Terminated = 'TERMINATED'
}

export type CreateCompanyInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  registerNumber?: InputMaybe<Scalars['String']['input']>;
  vatNumber?: InputMaybe<Scalars['String']['input']>;
};

export type CreateContractRateInput = {
  materialId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  unit: UnitType;
  unitPrice: Scalars['Float']['input'];
};

export type CreateHandoverActInput = {
  actDate: Scalars['String']['input'];
  actNumber: Scalars['String']['input'];
  checkedByUserId?: InputMaybe<Scalars['ID']['input']>;
  contractId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  preparedByUserId?: InputMaybe<Scalars['ID']['input']>;
  settlementId: Scalars['ID']['input'];
  signedByOwnerName?: InputMaybe<Scalars['String']['input']>;
  signedByRenterName?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateMasterContractInput = {
  contractNumber: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  ownerCompanyId: Scalars['ID']['input'];
  rates: Array<CreateContractRateInput>;
  renterCompanyId: Scalars['ID']['input'];
  startDate: Scalars['String']['input'];
};

export type CreateMaterialInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  defaultPrice: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  ownerCompanyId: Scalars['ID']['input'];
  unit: UnitType;
};

export type CreateRentalUsageInput = {
  contractId: Scalars['ID']['input'];
  endDate: Scalars['String']['input'];
  materialId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Float']['input'];
  startDate: Scalars['String']['input'];
  unit: UnitType;
  unitPrice?: InputMaybe<Scalars['Float']['input']>;
  usageDays: Scalars['Int']['input'];
};

export type CreateSettlementInput = {
  contractId: Scalars['ID']['input'];
  periodEnd: Scalars['String']['input'];
  periodStart: Scalars['String']['input'];
  settlementNumber: Scalars['String']['input'];
  tax: Scalars['Float']['input'];
};

export type CreateUserInput = {
  companyId: Scalars['ID']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  isCompanyOwner?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
  permission?: InputMaybe<UserPermission>;
  phone: Scalars['String']['input'];
  position?: InputMaybe<Scalars['String']['input']>;
};

export type HandoverAct = {
  __typename?: 'HandoverAct';
  actDate: Scalars['String']['output'];
  actNumber: Scalars['String']['output'];
  checkedByUserId?: Maybe<Scalars['ID']['output']>;
  contractId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  items: Array<SettlementItem>;
  notes?: Maybe<Scalars['String']['output']>;
  ownerCompany: Company;
  ownerCompanyId: Scalars['ID']['output'];
  preparedByUserId?: Maybe<Scalars['ID']['output']>;
  renterCompany: Company;
  renterCompanyId: Scalars['ID']['output'];
  settlementId: Scalars['ID']['output'];
  signedByOwnerName?: Maybe<Scalars['String']['output']>;
  signedByRenterName?: Maybe<Scalars['String']['output']>;
  status: ActStatus;
  title: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

export type MasterContract = {
  __typename?: 'MasterContract';
  contractNumber: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  endDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  ownerCompany: Company;
  ownerCompanyId: Scalars['ID']['output'];
  rates: Array<ContractRate>;
  renterCompany: Company;
  renterCompanyId: Scalars['ID']['output'];
  startDate: Scalars['String']['output'];
  status: ContractStatus;
  updatedAt: Scalars['String']['output'];
};

export type Material = {
  __typename?: 'Material';
  code?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  defaultPrice: Scalars['Float']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  ownerCompany: Company;
  ownerCompanyId: Scalars['ID']['output'];
  unit: UnitType;
  updatedAt: Scalars['String']['output'];
};

export enum MovementType {
  Out = 'OUT',
  Return = 'RETURN'
}

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  createCompany: Company;
  createHandoverAct: HandoverAct;
  createMasterContract: MasterContract;
  createMaterial: Material;
  createRentalUsage: RentalUsage;
  createSettlement: Settlement;
  createUser: User;
  updateCompany: Company;
  updateMasterContractStatus: MasterContract;
  updateMaterial: Material;
  updateUser: User;
};


export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};


export type MutationCreateHandoverActArgs = {
  input: CreateHandoverActInput;
};


export type MutationCreateMasterContractArgs = {
  input: CreateMasterContractInput;
};


export type MutationCreateMaterialArgs = {
  input: CreateMaterialInput;
};


export type MutationCreateRentalUsageArgs = {
  input: CreateRentalUsageInput;
};


export type MutationCreateSettlementArgs = {
  input: CreateSettlementInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationUpdateCompanyArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCompanyInput;
};


export type MutationUpdateMasterContractStatusArgs = {
  input: UpdateMasterContractStatusInput;
};


export type MutationUpdateMaterialArgs = {
  id: Scalars['ID']['input'];
  input: UpdateMaterialInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  companies: Array<Company>;
  company?: Maybe<Company>;
  handoverAct?: Maybe<HandoverAct>;
  handoverActs: Array<HandoverAct>;
  masterContract?: Maybe<MasterContract>;
  masterContracts: Array<MasterContract>;
  material?: Maybe<Material>;
  materials: Array<Material>;
  rentalUsage?: Maybe<RentalUsage>;
  rentalUsages: Array<RentalUsage>;
  settlement?: Maybe<Settlement>;
  settlements: Array<Settlement>;
  user?: Maybe<User>;
  userByEmail?: Maybe<User>;
  users: Array<User>;
};


export type QueryCompanyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryHandoverActArgs = {
  id: Scalars['ID']['input'];
};


export type QueryHandoverActsArgs = {
  contractId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryMasterContractArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMaterialArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMaterialsArgs = {
  ownerCompanyId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryRentalUsageArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRentalUsagesArgs = {
  contractId?: InputMaybe<Scalars['ID']['input']>;
  materialId?: InputMaybe<Scalars['ID']['input']>;
};


export type QuerySettlementArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySettlementsArgs = {
  contractId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  companyId?: InputMaybe<Scalars['ID']['input']>;
};

export type RentalUsage = {
  __typename?: 'RentalUsage';
  contractId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  endDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lineTotal: Scalars['Float']['output'];
  material: Material;
  materialId: Scalars['ID']['output'];
  movementDate: Scalars['String']['output'];
  movementType: MovementType;
  notes?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Float']['output'];
  startDate: Scalars['String']['output'];
  unit: UnitType;
  unitPrice: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  usageDays: Scalars['Int']['output'];
};

export type Settlement = {
  __typename?: 'Settlement';
  contract: MasterContract;
  contractId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  items: Array<SettlementItem>;
  periodEnd: Scalars['String']['output'];
  periodStart: Scalars['String']['output'];
  settlementNumber: Scalars['String']['output'];
  status: SettlementStatus;
  subtotal: Scalars['Float']['output'];
  tax: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

export type SettlementItem = {
  __typename?: 'SettlementItem';
  id: Scalars['ID']['output'];
  lineTotal: Scalars['Float']['output'];
  materialName: Scalars['String']['output'];
  quantity: Scalars['Float']['output'];
  unit: UnitType;
  unitPrice: Scalars['Float']['output'];
  usageDays: Scalars['Int']['output'];
  usageId: Scalars['ID']['output'];
};

export enum SettlementStatus {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Draft = 'DRAFT',
  Paid = 'PAID'
}

export enum UnitType {
  M2 = 'M2',
  M3 = 'M3',
  Pcs = 'PCS',
  Ton = 'TON'
}

export type UpdateCompanyInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone: Scalars['String']['input'];
  registerNumber?: InputMaybe<Scalars['String']['input']>;
  vatNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMasterContractStatusInput = {
  contractId: Scalars['ID']['input'];
  status: ContractStatus;
};

export type UpdateMaterialInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  defaultPrice?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<UnitType>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  permission?: InputMaybe<UserPermission>;
  phone?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  company: Company;
  companyId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isCompanyOwner: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  permission: UserPermission;
  phone: Scalars['String']['output'];
  position?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export enum UserPermission {
  FullAccess = 'FULL_ACCESS',
  QuantityOnly = 'QUANTITY_ONLY'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  ActStatus: ActStatus;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Company: ResolverTypeWrapper<Company>;
  CompanyRole: CompanyRole;
  ContractRate: ResolverTypeWrapper<ContractRate>;
  ContractStatus: ContractStatus;
  CreateCompanyInput: CreateCompanyInput;
  CreateContractRateInput: CreateContractRateInput;
  CreateHandoverActInput: CreateHandoverActInput;
  CreateMasterContractInput: CreateMasterContractInput;
  CreateMaterialInput: CreateMaterialInput;
  CreateRentalUsageInput: CreateRentalUsageInput;
  CreateSettlementInput: CreateSettlementInput;
  CreateUserInput: CreateUserInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  HandoverAct: ResolverTypeWrapper<HandoverAct>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  MasterContract: ResolverTypeWrapper<MasterContract>;
  Material: ResolverTypeWrapper<Material>;
  MovementType: MovementType;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RentalUsage: ResolverTypeWrapper<RentalUsage>;
  Settlement: ResolverTypeWrapper<Settlement>;
  SettlementItem: ResolverTypeWrapper<SettlementItem>;
  SettlementStatus: SettlementStatus;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UnitType: UnitType;
  UpdateCompanyInput: UpdateCompanyInput;
  UpdateMasterContractStatusInput: UpdateMasterContractStatusInput;
  UpdateMaterialInput: UpdateMaterialInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
  UserPermission: UserPermission;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Company: Company;
  ContractRate: ContractRate;
  CreateCompanyInput: CreateCompanyInput;
  CreateContractRateInput: CreateContractRateInput;
  CreateHandoverActInput: CreateHandoverActInput;
  CreateMasterContractInput: CreateMasterContractInput;
  CreateMaterialInput: CreateMaterialInput;
  CreateRentalUsageInput: CreateRentalUsageInput;
  CreateSettlementInput: CreateSettlementInput;
  CreateUserInput: CreateUserInput;
  Float: Scalars['Float']['output'];
  HandoverAct: HandoverAct;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  MasterContract: MasterContract;
  Material: Material;
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  RentalUsage: RentalUsage;
  Settlement: Settlement;
  SettlementItem: SettlementItem;
  String: Scalars['String']['output'];
  UpdateCompanyInput: UpdateCompanyInput;
  UpdateMasterContractStatusInput: UpdateMasterContractStatusInput;
  UpdateMaterialInput: UpdateMaterialInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
};

export type CompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  registerNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['CompanyRole'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ContractRateResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContractRate'] = ResolversParentTypes['ContractRate']> = {
  contractId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  material?: Resolver<ResolversTypes['Material'], ParentType, ContextType>;
  materialId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['UnitType'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type HandoverActResolvers<ContextType = any, ParentType extends ResolversParentTypes['HandoverAct'] = ResolversParentTypes['HandoverAct']> = {
  actDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  actNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  checkedByUserId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  contractId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['SettlementItem']>, ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ownerCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  ownerCompanyId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  preparedByUserId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  renterCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  renterCompanyId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  settlementId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  signedByOwnerName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signedByRenterName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ActStatus'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type MasterContractResolvers<ContextType = any, ParentType extends ResolversParentTypes['MasterContract'] = ResolversParentTypes['MasterContract']> = {
  contractNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ownerCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  ownerCompanyId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  rates?: Resolver<Array<ResolversTypes['ContractRate']>, ParentType, ContextType>;
  renterCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  renterCompanyId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ContractStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type MaterialResolvers<ContextType = any, ParentType extends ResolversParentTypes['Material'] = ResolversParentTypes['Material']> = {
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  defaultPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownerCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  ownerCompanyId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['UnitType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationCreateCompanyArgs, 'input'>>;
  createHandoverAct?: Resolver<ResolversTypes['HandoverAct'], ParentType, ContextType, RequireFields<MutationCreateHandoverActArgs, 'input'>>;
  createMasterContract?: Resolver<ResolversTypes['MasterContract'], ParentType, ContextType, RequireFields<MutationCreateMasterContractArgs, 'input'>>;
  createMaterial?: Resolver<ResolversTypes['Material'], ParentType, ContextType, RequireFields<MutationCreateMaterialArgs, 'input'>>;
  createRentalUsage?: Resolver<ResolversTypes['RentalUsage'], ParentType, ContextType, RequireFields<MutationCreateRentalUsageArgs, 'input'>>;
  createSettlement?: Resolver<ResolversTypes['Settlement'], ParentType, ContextType, RequireFields<MutationCreateSettlementArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  updateCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationUpdateCompanyArgs, 'id' | 'input'>>;
  updateMasterContractStatus?: Resolver<ResolversTypes['MasterContract'], ParentType, ContextType, RequireFields<MutationUpdateMasterContractStatusArgs, 'input'>>;
  updateMaterial?: Resolver<ResolversTypes['Material'], ParentType, ContextType, RequireFields<MutationUpdateMaterialArgs, 'id' | 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id' | 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  companies?: Resolver<Array<ResolversTypes['Company']>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType, RequireFields<QueryCompanyArgs, 'id'>>;
  handoverAct?: Resolver<Maybe<ResolversTypes['HandoverAct']>, ParentType, ContextType, RequireFields<QueryHandoverActArgs, 'id'>>;
  handoverActs?: Resolver<Array<ResolversTypes['HandoverAct']>, ParentType, ContextType, Partial<QueryHandoverActsArgs>>;
  masterContract?: Resolver<Maybe<ResolversTypes['MasterContract']>, ParentType, ContextType, RequireFields<QueryMasterContractArgs, 'id'>>;
  masterContracts?: Resolver<Array<ResolversTypes['MasterContract']>, ParentType, ContextType>;
  material?: Resolver<Maybe<ResolversTypes['Material']>, ParentType, ContextType, RequireFields<QueryMaterialArgs, 'id'>>;
  materials?: Resolver<Array<ResolversTypes['Material']>, ParentType, ContextType, Partial<QueryMaterialsArgs>>;
  rentalUsage?: Resolver<Maybe<ResolversTypes['RentalUsage']>, ParentType, ContextType, RequireFields<QueryRentalUsageArgs, 'id'>>;
  rentalUsages?: Resolver<Array<ResolversTypes['RentalUsage']>, ParentType, ContextType, Partial<QueryRentalUsagesArgs>>;
  settlement?: Resolver<Maybe<ResolversTypes['Settlement']>, ParentType, ContextType, RequireFields<QuerySettlementArgs, 'id'>>;
  settlements?: Resolver<Array<ResolversTypes['Settlement']>, ParentType, ContextType, Partial<QuerySettlementsArgs>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  userByEmail?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserByEmailArgs, 'email'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryUsersArgs>>;
};

export type RentalUsageResolvers<ContextType = any, ParentType extends ResolversParentTypes['RentalUsage'] = ResolversParentTypes['RentalUsage']> = {
  contractId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lineTotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  material?: Resolver<ResolversTypes['Material'], ParentType, ContextType>;
  materialId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  movementDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  movementType?: Resolver<ResolversTypes['MovementType'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['UnitType'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  usageDays?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type SettlementResolvers<ContextType = any, ParentType extends ResolversParentTypes['Settlement'] = ResolversParentTypes['Settlement']> = {
  contract?: Resolver<ResolversTypes['MasterContract'], ParentType, ContextType>;
  contractId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['SettlementItem']>, ParentType, ContextType>;
  periodEnd?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  periodStart?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  settlementNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['SettlementStatus'], ParentType, ContextType>;
  subtotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tax?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type SettlementItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['SettlementItem'] = ResolversParentTypes['SettlementItem']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lineTotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  materialName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['UnitType'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  usageDays?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  usageId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  companyId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isCompanyOwner?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permission?: Resolver<ResolversTypes['UserPermission'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Company?: CompanyResolvers<ContextType>;
  ContractRate?: ContractRateResolvers<ContextType>;
  HandoverAct?: HandoverActResolvers<ContextType>;
  MasterContract?: MasterContractResolvers<ContextType>;
  Material?: MaterialResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RentalUsage?: RentalUsageResolvers<ContextType>;
  Settlement?: SettlementResolvers<ContextType>;
  SettlementItem?: SettlementItemResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

