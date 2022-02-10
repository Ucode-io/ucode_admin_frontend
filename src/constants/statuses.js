export const newStatusId = ""

export const statusList = [
  {
    label: 'NewStatusId',
    id: '986a0d09-7b4d-4ca9-8567-aa1c6d770505'
  },
  {
    label: 'FutureStatusId',
    id: 'bf9cc968-367d-4391-93fa-f77eda2a7a99'
  },
  {
    label: 'OperatorAcceptedStatusId',
    id: 'ccb62ffb-f0e1-472e-bf32-d130bea90617'
  },
  // {
  //   label: 'OperatorCancelledStatusId',
  //   id: 'b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1'
  // },
  {
    label: 'VendorAcceptedStatusId',
    id: '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3'
  },
  {
    label: 'VendorCancelledStatusId',
    id: 'c4227d1b-c317-46f8-b1e3-a48c2496206f'
  },
  {
    label: 'VendorReadyStatusId',
    id: 'b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd'
  },
  {
    label: 'CourierCancelledStatusId',
    id: '6ba783a3-1c2e-479c-9626-25526b3d9d36'
  },
  {
    label: 'CourierAcceptedStatusId',
    id: '8781af8e-f74d-4fb6-ae23-fd997f4a2ee0'
  },
  {
    label: 'CourierPickedUpStatusId',
    id: '84be5a2f-3a92-4469-8283-220ca34a0de4'
  },
  {
    label: 'DeliveredStatusId',
    id: '79413606-a56f-45ed-97c3-f3f18e645972'
  },
  {
    label: 'FinishedStatusId',
    id: 'e665273d-5415-4243-a329-aee410e39465'
  },
  {
    label: 'ServerCancelledStatusId',
    id: 'd39cb255-6cf5-4602-896d-9c559d40cbbe'
  },
]

export const statusTabList = [
  {
    label: 'new',
    id: '986a0d09-7b4d-4ca9-8567-aa1c6d770505'
  },
  // {
  //   label: 'FutureStatusId',
  //   id: 'bf9cc968-367d-4391-93fa-f77eda2a7a99'
  // },
  {
    label: 'operator.accepted',
    id: 'ccb62ffb-f0e1-472e-bf32-d130bea90617'
  },
  {
    label: 'work.process',
    id: '1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3,b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd,8781af8e-f74d-4fb6-ae23-fd997f4a2ee0'
  },
  {
    label: 'courier.onTheWay',
    id: '84be5a2f-3a92-4469-8283-220ca34a0de4'
  },
  {
    label: 'finished',
    id: 'e665273d-5415-4243-a329-aee410e39465,79413606-a56f-45ed-97c3-f3f18e645972'
  },
  {
    label: 'all.orders',
    id: '986a0d09-7b4d-4ca9-8567-aa1c6d770505,ccb62ffb-f0e1-472e-bf32-d130bea90617,bf9cc968-367d-4391-93fa-f77eda2a7a99,b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1,1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3,c4227d1b-c317-46f8-b1e3-a48c2496206f,b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd,6ba783a3-1c2e-479c-9626-25526b3d9d36,8781af8e-f74d-4fb6-ae23-fd997f4a2ee0,84be5a2f-3a92-4469-8283-220ca34a0de4,79413606-a56f-45ed-97c3-f3f18e645972,e665273d-5415-4243-a329-aee410e39465,d39cb255-6cf5-4602-896d-9c559d40cbbe'
  },
  // {
  //   label: 'all.orders',
  //   id: undefined
  // },
]

export const historyStatuses = {
  ids: "b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1,c4227d1b-c317-46f8-b1e3-a48c2496206f,6ba783a3-1c2e-479c-9626-25526b3d9d36,79413606-a56f-45ed-97c3-f3f18e645972,e665273d-5415-4243-a329-aee410e39465,d39cb255-6cf5-4602-896d-9c559d40cbbe"
}

export const currentStatuses = {
  ids: "986a0d09-7b4d-4ca9-8567-aa1c6d770505,bf9cc968-367d-4391-93fa-f77eda2a7a99,ccb62ffb-f0e1-472e-bf32-d130bea90617,1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3,b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd,8781af8e-f74d-4fb6-ae23-fd997f4a2ee0,84be5a2f-3a92-4469-8283-220ca34a0de4"
}

export const makeStatusList = (t) => statusList.map(elm => ({ ...elm, label: t(elm.label) }))

