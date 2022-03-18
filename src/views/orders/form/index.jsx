import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import {
  postOrder,
  updateOrder,
  getOneOrder,
  getBranches,
  getNearestBranch,
  getComputeDeliveryPrice,
  getDeliveryPrice,
  getCustomers,
  changeOrderStatus,
  postCustomer,
} from "services";
import MainContent from "./MainContent";
import ProductContent from "./ProductsContent";
import Button from "components/Button";
import Header from "components/Header";
import "./style.scss";
import CustomSkeleton from "components/Skeleton";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import SaveIcon from "@material-ui/icons/Save";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import CancelIcon from "@material-ui/icons/Cancel";
import Filter from "components/Filters";
import PrintIcon from "@material-ui/icons/Print";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import TagBtn from "components/Tag/TimeTag";
import orderTimer from "helpers/orderTimer";
import { showAlert } from "redux/actions/alertActions";
import { getAddressListYandex } from "services/yandex";

export default function CreateClient() {
  const { t } = useTranslation();
  const params = useParams();
  const history = useHistory();
  const [createdTime, setCreatedTime] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [branches, setBranches] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [placemarkGeometry, setPlacemarkGeometry] = useState([]);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const { region_id } = useSelector((state) => state.auth);
  const [regionId, setRegionId] = useState(null);
  const [mapChange, setMapChange] = useState(false);
  const [tabValue, setTabValue] = useState("Основное");
  const [searchAddress, setSearchAddress] = useState("");
  const [distance, setDistance] = useState();
  const [item, setItem] = useState(null);
  const [branch, setBranch] = useState(null);

  const tabLabel = (text) => {
    return <span className="px-1">{text}</span>;
  };

  const productRef = useRef();
  const branchOption =
    item &&
    item?.branches?.map((elm) => ({ label: elm.name, value: elm.id, elm }));

  const initialValues = useMemo(
    () => ({
      aggregator_id: null,
      building: null,
      extra_phone_number: null,
      client: null,
      // client_type: null,
      is_courier_call: false,
      co_delivery_price: null,
      delivery_time: null,
      description: null,
      delivery_type: { label: "Доставка", value: "delivery" },
      is_reissued: false,
      paid: false,
      payment_type: "cash",
      source: "admin_panel",
      to_address: "",
      // restaurant: null,
      apartment: null,
      branch: branchOption ? branchOption && branchOption[0].value : null,
      future_time: null,
      floor: null,
      // intercom: null,
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      client: defaultSchema,
      delivery_type: defaultSchema,
      to_address: defaultSchema,
      branch: defaultSchema,
    });
  }, []);

  useEffect(() => {
    (async () => {
      getBranches({
        limit: 1000,
        page: 1,
      }).then((res) => {
        setBranches(res);
      });

      const _deliveryPrice = await getDeliveryPrice()
        .then((res) => res.price)
        .catch((err) => console.log(err));

      if (!params.id) setDeliveryPrice(_deliveryPrice);

      fetchData({ _deliveryPrice });
    })();
  }, []);
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    setSaveLoading(true);

    const _values = { ...values };

    if (values.client.action === "create-option") {
      const { id } = await postCustomer({
        name: values.client_name,
        phone: values.client.label,
      });
      _values.client.value = id;
    }

    if (selectedProducts.length == 0) {
      dispatch(showAlert("Добавьте продукты"));
      productRef?.current?.scrollIntoView();
      setSaveLoading(false);
      return;
    }

    const data = {
      ..._values,
      // region_id: regionId || region_id,
      // client_type: values.client_type.value,
      client_id: values.client.value,
      co_delivery_price: deliveryPrice,
      to_location: { lat: placemarkGeometry[0], long: placemarkGeometry[1] },
      delivery_type: values.delivery_type.value,
      courier_id: values?.courier?.value,
      steps: [
        {
          branch_id: values.branch?.value,
          products: selectedProducts.map((item) => {
            delete item.optionPrice;
            delete item.optionChildPrice;
            delete item.ingredientsPrice;
            delete item?.option?.is_default;
            item?.option?.child_options?.forEach((val) => {
              if (val) delete val.is_default;
            });
            return {
              ...item,
            };
          }),
        },
      ],
    };
    delete data.branch;
    delete data.client;
    delete data.client_name;
    delete data.shipper;
    delete data.courier;
    delete data.client_type;

    if (params.id) {
      try {
        data.shipper_id = values?.shipper?.value;
        await updateOrder(params.id, data);
        await changeOrderStatus(
          params.id,
          {
            status_id: "ccb62ffb-f0e1-472e-bf32-d130bea90617",
            description: "new order updated",
          },
          values?.shipper?.value,
        );
        history.push("/home/orders");
      } catch (e) {
        console.log(e);
      } finally {
        setSaveLoading(false);
      }
    } else {
      postOrder(data)
        .then((res) => history.push("/home/orders"))
        .finally(() => setSaveLoading(false));
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  useEffect(() => {
    if (placemarkGeometry.length > 0) {
      getNearestBranch({
        lat: placemarkGeometry[0],
        long: placemarkGeometry[1],
      }).then((res) => {
        const elm = res.branches[0];
        formik.setFieldValue(
          "branch",
          elm ? { label: elm.name, value: elm.id, elm } : null,
        );
        setBranch(res);
      });
    }
  }, [placemarkGeometry]);

  useEffect(() => {
    if (searchAddress) {
      getAddressListYandex({
        text: searchAddress,
        //ll: `${placemarkGeometry[1]},${placemarkGeometry[0]}`,
      }).then((res) => {
        if (res.status === 200) {
          setAddressList(
            res.data.features.map((item) => ({
              label: item.properties.name,
              value: item.properties.CompanyMetaData.id,
              id: item.properties.CompanyMetaData.id,
              description: item.properties.description,
              ...item,
            })),
          );
        }
      });
    } else {
      setAddressList([]);
    }
  }, [searchAddress]);

  useEffect(() => {
    if (formik.values.branch && placemarkGeometry.length > 0) {
      if (mapChange) {
        setMapLoading((prev) => !prev);
        getComputeDeliveryPrice({
          branch_id: formik.values.branch.value,
          // date_time: moment().format("YYYY-MM-DD hh:mm:ss"),
          lat: placemarkGeometry[0],
          long: placemarkGeometry[1],
        })
          .then((res) => {
            setDeliveryPrice(res.price);
            setDistance(res.distance);
          })
          .finally(() => {
            setMapLoading((prev) => !prev);
          });
      }
    }
  }, [placemarkGeometry, formik.values.branch]);

  const fetchData = ({ _shippers, _customers, _deliveryPrice }) => {
    if (!params.id) {
      setMapChange(true);
      setLoader(false);
      return;
    }
    getOneOrder(params.id)
      .then((res) => {
        setCreatedTime(res.created_at);
        setRegionId(res.region_id);
        console.log("res", res);
        formik.setValues({
          // client: res.client_name ?? "",
          is_courier_call: res.is_courier_call,
          description: res.description,
          client: res.client_phone_number
            ? {
                label: res.client_phone_number + ` (${res.client_name})`,
                value: res.client_id,
              }
            : null,
          client_name: res.client_name,
          apartment: res.apartment,
          building: res.building,
          floor: res.floor,
          delivery_type:
            res.delivery_type === "delivery"
              ? { label: t("type-delivery"), value: res.delivery_type }
              : { label: t("type-self-pickup"), value: res.delivery_type },
          is_reissued: res.is_reissued,
          paid: res.paid,
          payment_type: res.payment_type,
          source: res.source,
          to_address: res.to_address,
          external_order_id: res.external_order_id,
          branch: {
            elm: {
              phone: res.steps[0].phone_number,
              address: res.steps[0].address,
            },
            label: res.steps[0].branch_name,
            value: res.steps[0].id,
          },
        });
        setPlacemarkGeometry([res.to_location.lat, res.to_location.long]);
        setSelectedProducts(res.steps[0].products);
        setDeliveryPrice(res.delivery_price);
      })
      .finally(() => setLoader(false));
  };

  const formatLikeOptions = (arr) =>
    arr.map((elm) => ({ label: elm.name, value: elm.id, elm }));

  if (loader)
    return (
      <div>
        <CustomSkeleton />
      </div>
    );

  const extraFilter = (
    <div className="flex gap-4">
      <Button
        icon={PrintIcon}
        color="zink"
        size="medium"
        shape="outlined"
        onClick={() => {}}
        borderColor="bordercolor"
      >
        {t("print")}
      </Button>
    </div>
  );

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Header
          title={t("order")}
          startAdornment={[
            params.id && (
              <h3 className="pr-4 text-secondary text-sm text-medium">
                ID {formik?.values?.external_order_id}
              </h3>
            ),
            params.id && (
              <h3 className="text-secondary text-sm flex items-center">
                <CalendarTodayIcon
                  style={{ marginRight: "8px" }}
                  fontSize="small"
                />{" "}
                {formik?.values?.client?.elm?.created_at}
              </h3>
            ),
          ]}
          endAdornment={[
            params.id && (
              <TagBtn
                iconLeft={<QueryBuilderIcon fontSize="small" />}
                color="#1AC19D"
                bgColor="rgba(56, 217, 185, 0.15)"
              >
                <span className="ml-3">
                  {createdTime && orderTimer(createdTime)}
                </span>
              </TagBtn>
            ),
            params.id && (
              <TagBtn
                iconRight={<KeyboardArrowDownIcon fontSize="small" />}
                color="#4094F7"
                bgColor="rgba(64, 148, 247, 0.15)"
              >
                <span className="mr-3">Доставлен</span>
              </TagBtn>
            ),
            <Button
              icon={CancelIcon}
              color="red"
              shape="outlined"
              onClick={() => history.goBack()}
              size="large"
              borderColor="bordercolor"
            >
              {t("cancel")}
            </Button>,
            <Button
              size="large"
              icon={SaveIcon}
              type="submit"
              loading={saveLoading}
              onClick={() => {
                console.log(formik.values);
              }}
            >
              {t("save")}
            </Button>,
          ]}
        />
        <Filter extra={extraFilter}>
          <StyledTabs
            value={tabValue}
            onChange={(e, val) => {
              setTabValue(val);
            }}
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
          >
            <StyledTab label={tabLabel(t("Основное"))} value="Основное" />
            <StyledTab
              label={tabLabel(t("История изменений"))}
              value="История изменений"
            />
          </StyledTabs>
        </Filter>

        <div
          className="p-4 w-full box-border font-body flex flex-col gap-4"
          style={{ fontSize: "14px", lineHeight: "24px" }}
        >
          <MainContent
            formik={formik}
            branches={branches}
            branch={branch}
            deliveryPrice={deliveryPrice}
            placemarkGeometry={placemarkGeometry}
            setPlacemarkGeometry={setPlacemarkGeometry}
            setMapChange={setMapChange}
            params={params}
            mapLoading={mapLoading}
            setAddressList={setAddressList}
            addressList={addressList}
            setSearchAddress={setSearchAddress}
            distance={distance}
            setItem={setItem}
          />
          <ProductContent
            formik={formik}
            deliveryPrice={deliveryPrice}
            shipperId={formik.values?.shipper?.value}
            selectedProducts={selectedProducts}
            productRef={productRef}
            setSelectedProducts={setSelectedProducts}
          />
        </div>
      </form>
    </div>
  );
}
