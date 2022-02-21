import { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";
import Select from "../Select";

const EIMZOClient = window.EIMZOClient;
const EIMZO_MAJOR = 3;
const EIMZO_MINOR = 27;

EIMZOClient.API_KEYS = [
  "localhost",
  "96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B",
  "127.0.0.1",
  "A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F",
  "null",
  "E0A205EC4E7B78BBB56AFF83A733A1BB9FD39D562E67978CC5E7D73B0951DB1954595A20672A63332535E13CC6EC1E1FC8857BB09E0855D7E76E411B6FA16E9D",
  "dls.yt.uz",
  "EDC1D4AB5B02066FB3FEB9382DE6A7F8CBD095E46474B07568BC44C8DAE27B3893E75B79280EA82A38AD42D10EA0D600E6CE7E89D1629221E4363E2D78650516",
];

const ESPSelect = ({ onChange = () => {}, ...props }) => {
  const dispatch = useDispatch();
  const [keysList, setKeysList] = useState([]);
  const [PKCS7, setPKCS7] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    checkVersion();
  }, []);

  useEffect(() => {
    onChange(PKCS7);
  }, [PKCS7]);

  const computedOptions = useMemo(() => {
    if (keysList.length < 1) return [];

    return keysList.map((key) => ({
      value: key,
      label: key.UID + " - " + key.CN,
    }));
  }, [keysList]);

  // ================CHECK VERSION==========================
  const checkVersion = () => {
    EIMZOClient.checkVersion(
      function (major, minor) {
        const newVersion = EIMZO_MAJOR * 100 + EIMZO_MINOR;
        const installedVersion = parseInt(major) * 100 + parseInt(minor);

        if (installedVersion < newVersion) {
          return alert(
            "Sizning E-IMZO dasturingiz versiyasi eskirgan, iltimos E-IMZO dasturini yangilang",
          );
        }

        EIMZOClient.installApiKeys(
          function () {
            loadKeys();
          },
          function (e, r) {
            if (r) {
              dispatch(showAlert(r));
            } else {
              alert("ERROR");
            }
          },
        );
      },

      function (e, r) {
        if (r) {
          dispatch(showAlert(r));
        } else {
          dispatch(
            showAlert(
              "Sizda E-IMZO dasturi yoqilmagan, iltimos dasturni ishga tushiring",
            ),
          );
        }
      },
    );
  };

  // ==================LOAD KEYS=======================

  const loadKeys = () => {
    clearKeysList();

    EIMZOClient.listAllUserKeys(
      function (o, i) {
        const itemId = "itm-" + o.serialNumber + "-" + i;
        return itemId;
      },

      function (itemId, keyData) {
        const newItem = checkExpire(itemId, keyData);
        return newItem;
      },

      function (items, firstId) {
        setKeysList(items);
      },

      function (e, r) {
        alert("E-IMZO dasturi topilmadi yoki ishga tushmagan");
      },
    );
  };

  // ==================CREATE ITEM=================

  const checkExpire = (itemId, keyData) => {
    const now = new Date();
    keyData.expired = window.dates.compare(now, keyData.validTo) > 0;
    keyData.itemId = itemId;
    return keyData;
  };

  //  =================CLEAR KEYS LIST=======================

  const clearKeysList = () => setKeysList([]);

  // ====================SIGN=============================

  const sign = (keyData) => {
    const itm = keyData.itemId;
    if (!itm) return alert("error5");

    EIMZOClient.loadKey(
      keyData,
      function (id) {
        EIMZOClient.createPkcs7(
          id,
          "description",
          null,
          function (pkcs7) {
            setPKCS7(pkcs7);
          },
          function (e, r) {
            errorHandler(r);
            if (e) alert(e);
          },
        );
      },
      function (e, r) {
        errorHandler(r);
        if (e) {
          alert(e);
        }
      },
    );
  };

  // ================ERROR HANDLER=====================

  const errorHandler = (error) => {
    if (error) {
      setSelectedKey(null);
      if (error.includes("password")) {
        dispatch(showAlert("Parolni noto'gri kiritdingiz"));
      } else {
        dispatch(showAlert(error));
      }
    } else {
      alert(
        "Sizning brauzeringiz E-IMZO ni qo'llab-quvvatlamaydi. Iltimos boshqa brauzerda sinab ko'ring",
      );
    }
  };

  // ==================SELECT HANDLER===========================

  const selectHandler = (val) => {
    setSelectedKey(val);
    sign(val.value);
  };

  return (
    <Select
      {...props}
      options={computedOptions}
      value={selectedKey}
      onChange={selectHandler}
    />
  );
};

export default ESPSelect;
