import { FaBirthdayCake, FaHouseUser } from "react-icons/fa";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { MdOutlineLocalPostOffice } from "react-icons/md";
import type { Customer } from "../../../types/Customer";
import "./ProfileInfo.css";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Props = {
  customer: Customer;
};

function ProfileInfo({ customer }: Props) {
  console.log("PROFILE INFO CUSTOMER", customer);
  return (
    <section className="profile-info">
      <div className="profile-info__card">
        <div className="profile-info__item">
          <FiMail className="profile-info__icon" />
          <span className="profile-info__label">{customer.email}</span>
        </div>

        <div className="profile-info__item">
          <FiPhone className="profile-info__icon" />
          <span className="profile-info__label">{customer.phone}</span>
        </div>

        <div className="profile-info__item">
          <FiMapPin className="profile-info__icon" />
          <span className="profile-info__label">{customer.city}</span>
        </div>

        <div className="profile-info__item">
          <MdOutlineLocalPostOffice className="profile-info__icon" />
          <span className="profile-info__label">{customer.postal_code}</span>
        </div>

        <div className="profile-info__item">
          <FaHouseUser className="profile-info__icon" />
          <span className="profile-info__label">{customer.adress}</span>
        </div>

        <div className="profile-info__item">
          <FaBirthdayCake className="profile-info__icon" />
          <span className="profile-info__label">
            {customer.birthday
              ? format(new Date(customer.birthday), "dd MMMM yyyy", {
                  locale: fr,
                })
              : ""}
          </span>
        </div>
      </div>
    </section>
  );
}
export default ProfileInfo;
