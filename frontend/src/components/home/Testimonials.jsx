import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { getFeaturedReviews } from "../../services/reviewService";

const ROTATIONS = ["-rotate-1", "rotate-1", "-rotate-1", "rotate-1", "rotate-2", "-rotate-2"];

function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getFeaturedReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Nothing genuine to show yet (fresh install, no reviews) - skip the
  // section entirely rather than displaying an empty or fake block.
  if (!loading && reviews.length === 0) return null;

  return (
    <section className="py-24 bg-skytape border-y-[3px] border-ink">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="stamp-badge inline-block bg-mint text-ink px-3 py-1 text-xs rotate-1">
            Real Talk, Real Students
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-ink mt-4">
            WHAT'S PINNED ON THE BOARD
          </h2>
        </div>

        {loading ? (
          <p className="text-center font-display text-lg text-pencil">LOADING...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`relative bg-paper poster-border hard-shadow-sm rounded-2xl p-6 ${ROTATIONS[i % ROTATIONS.length]} hover:rotate-0 transition-transform`}
              >
                <div className="pin-dot" />
                <Quote className="text-marigold mb-3" size={26} fill="currentColor" strokeWidth={0} />

                <p className="text-ink font-medium leading-relaxed mb-5">
                  "{review.review}"
                </p>

                <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-ink/15">
                  <div>
                    <p className="font-semibold text-ink text-sm">{review.user_name}</p>
                    <p className="text-xs text-pencil">stayed at {review.hostel_name}</p>
                  </div>
                  <div className="flex text-marigold">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={13}
                        fill="currentColor"
                        className={idx < review.rating ? "" : "text-pencil-light"}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Testimonials;
