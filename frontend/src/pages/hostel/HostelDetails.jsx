import { useParams } from "react-router-dom";
import HostelDetailPanel from "../../components/hostel/HostelDetailPanel";

function HostelDetails() {
  const { id } = useParams();
  return <HostelDetailPanel hostelId={id} />;
}

export default HostelDetails;
