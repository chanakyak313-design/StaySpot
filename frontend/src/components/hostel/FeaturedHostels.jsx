import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllHostels } from "../../services/hostelService";
import HostelCard from "./HostelCard";

const ROTATIONS = ["-rotate-1", "rotate-1", "-rotate-1", "rotate-1", "rotate-2", "-rotate-2"];

function FeaturedHostels() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHostels();
  }, []);

  async function loadHostels() {
    try {
      const data = await getAllHostels();
      setHostels(data.slice(0, 6));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-24 bg-paper">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
          <div>
            <span className="stamp-badge inline-block bg-coral text-white px-3 py-1 text-xs rotate-1">
              This Week's Picks
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-ink mt-4">
              PINNED TO THE BOARD
            </h2>
          </div>
          <Link
            to="/hostels"
            className="btn-poster bg-paper text-ink px-5 py-2.5 hard-shadow-sm self-start"
          >
            See All Hostels
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="font-display text-xl text-pencil">LOADING THE BOARD...</p>
          </div>
        ) : hostels.length === 0 ? (
          <div className="text-center py-16 poster-border rounded-2xl bg-skytape">
            <p className="font-display text-xl text-ink">NOTHING PINNED YET</p>
            <p className="text-pencil mt-2">Check back soon — new hostels are added daily.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {hostels.map((hostel, i) => (
              <HostelCard
                key={hostel.id}
                hostel={hostel}
                rotate={ROTATIONS[i % ROTATIONS.length]}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedHostels;
