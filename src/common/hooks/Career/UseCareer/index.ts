import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { Career } from "../../../interfaces/Career";
import { auth } from "../../../services/Firebase";
import { ServiceCareer } from "../../../services/ServiceCareer";

export const useCareers = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(true);
        const unsubscribeCareers = ServiceCareer.getAll((data) => {
          setCareers(data);
          setLoading(false);
        });
        return () => unsubscribeCareers && unsubscribeCareers();
      } else {
        setCareers([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return { careers, loading };
};
