import React, { useEffect, useState } from 'react';
import AdsButtom from '../components/AdsButtom';
import AdsTop from '../components/AdsTop';
import { useNavigate } from 'react-router-dom';

import subjectPageTranslate from '../language/subjectPage.json';
import { getAuthToken } from '../utils/getAuthToken';
import API from '../utils/axios';

function SubjectList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');
  const navigate = useNavigate();

  // ✅ Token getter


  useEffect(() => {
    const fetchSubjects = async () => {
      const storedLang = localStorage.getItem('lang') || 'en';
      setLang(storedLang); // update lang state

      const token = getAuthToken();
      if (!token) {
        console.warn('No auth token found');
        setLoading(false);
        return;
      }

      try {
        const response = await API.get(`/subjects?lang=${storedLang}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);


  const handleSubjectClick = (subjectName,subjectId, categoryName) => {
    const slug = subjectName.toLowerCase().replace(/\s+/g, '-');

    // alert(subjectName)
    navigate(`/subjects/${slug}`, {
      state: {
        subject: subjectId,
        category: categoryName
      }
    });
  };

  const trans = subjectPageTranslate[lang] || subjectPageTranslate["en"];

  return (
    <div className="page-wrapper">
      <AdsTop />
      <div className="content-row">
        <main className="app-container">
          <h5 className='text-lg'>{trans.title}</h5>
          <p>{trans.subTitle}</p>
          <hr />
          {loading ? (
            <p>Loading subjects...</p>
          ) : (
            data.map((category) => (
              <div key={category.category_id}>
                <h6 className="mb-3 text-sm">{category.category}</h6>
                <div className="row g-2 text-xsm mb-2">
                  {category.subjects.map((subject) => (
                    <div className="col-6 col-md-4" key={subject.id}
                      onClick={() => {
                        handleSubjectClick(subject.name,subject.id, category.category_id);
                      }}>
                      <div className="stats-box mb-0 py-3">
                        <div className="fw-semibold text-left cursor-pointer">
                          {subject.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </main>
      </div>
      <AdsButtom />
    </div>
  );
}

export default SubjectList;
