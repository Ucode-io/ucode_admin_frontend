import Tag from "../../components/Tag/index"

export const statuses = {
  NewStatusId: "986a0d09-7b4d-4ca9-8567-aa1c6d770505",
  FutureStatusId: "bf9cc968-367d-4391-93fa-f77eda2a7a99",
  OperatorAcceptedStatusId: "ccb62ffb-f0e1-472e-bf32-d130bea90617",
  VendorAcceptedStatusId: "1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3",
  VendorReadyStatusId: "b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd",
  CourierAcceptedStatusId: "8781af8e-f74d-4fb6-ae23-fd997f4a2ee0",
  CourierPickedUpStatusId: "84be5a2f-3a92-4469-8283-220ca34a0de4",
  DeliveredStatusId: "79413606-a56f-45ed-97c3-f3f18e645972",
  FinishedStatusId: "e665273d-5415-4243-a329-aee410e39465",
  OperatorCancelledStatusId: "b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1",
  VendorCancelledStatusId: "c4227d1b-c317-46f8-b1e3-a48c2496206f",
  CourierCancelledStatusId: "6ba783a3-1c2e-479c-9626-25526b3d9d36",
  ServerCancelledStatusId: "d39cb255-6cf5-4602-896d-9c559d40cbbe",
}

const {
  NewStatusId,
  OperatorAcceptedStatusId,
  VendorReadyStatusId,
  VendorAcceptedStatusId,
  CourierAcceptedStatusId,
  CourierPickedUpStatusId,
  DeliveredStatusId,
  FinishedStatusId,
  OperatorCancelledStatusId,
  VendorCancelledStatusId,
  CourierCancelledStatusId,
  ServerCancelledStatusId,
  FutureStatusId,
} = statuses

export const statusCheck = (id, t) => {
  switch (id) {
    case NewStatusId:
      return (
        <Tag color="white" className="bg-blue-500 py-1" size="medium">
          {t("new")}
        </Tag>
      )
    case FutureStatusId:
      return (
        <Tag color="white" className="bg-blue-500 py-1" size="medium">
          {t("pre.order")}
        </Tag>
      )
    case OperatorAcceptedStatusId:
      return (
        <Tag className="bg-blue-500 py-1" color="white" size="medium">
          {t("operator.accepted")}
        </Tag>
      )
    case VendorReadyStatusId:
      return (
        <Tag className="bg-green-600 py-1" color="white" size="medium">
          {t("branch.prepared")}
        </Tag>
      )
    case VendorAcceptedStatusId:
      return (
        <Tag className="bg-black-2 py-1" color="white" size="medium">
          {t("branch.accepted")}
        </Tag>
      )
    case CourierAcceptedStatusId:
      return (
        <Tag className="bg-blue-500 py-1" color="white" size="medium">
          {t("courier.accepted")}
        </Tag>
      )
    case CourierPickedUpStatusId:
      return (
        <Tag color="white" className="bg-blue-500 py-1" size="medium">
          {t("courier.onTheWay")}
        </Tag>
      )
    case DeliveredStatusId:
      return (
        <Tag color="white" className="bg-green-500 py-1" size="medium">
          {t("delivered")}
        </Tag>
      )
    case FinishedStatusId:
      return (
        <Tag color="white" className="bg-green-700 py-1" size="medium">
          {t("finished")}
        </Tag>
      )
    case OperatorCancelledStatusId:
      return (
        <Tag color="white" className="bg-red-500 py-1" size="medium">
          {t("operator.declined")}
        </Tag>
      )
    case VendorCancelledStatusId:
      return (
        <Tag color="white" className="bg-red-500 py-1" size="medium">
          {t("branch.declined")}
        </Tag>
      )
    case CourierCancelledStatusId:
      return (
        <Tag color="white" className="bg-red-500 py-1" size="medium">
          {t("courier.declined")}
        </Tag>
      )
    case ServerCancelledStatusId:
      return (
        <Tag color="white" className="bg-red-500 py-1" size="medium">
          {t("server.declined")}
        </Tag>
      )
    default:
      return <></>
  }
}
