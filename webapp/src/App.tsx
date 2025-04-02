import React, { useEffect, useState } from "react";
import axios from "axios";

export interface Result {
  id: number;
  message: string;
  received_at: string;
}

const App: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [splashEffect, setSplashEffect] = useState<boolean>(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/results");
      const formattedResults: Result[] = response.data.results.map((result: any) => ({
        id: result[0],
        message: result[1],
        received_at: result[2],
      }));
      setResults(formattedResults);
      console.log("Fetched results:", formattedResults);
    } catch (err) {
      setError("ไม่สามารถดึงข้อมูลได้");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(); // เรียกใช้ fetchResults ตอนที่ component mount
  }, []);

  const handleWaterSplash = () => {
    setSplashEffect(true);
    setTimeout(() => setSplashEffect(false), 2000);
    fetchResults(); // รีเฟรชผลลัพธ์เมื่อคลิกปุ่ม
  };

  const formatThaiDate = (dateString: string): string => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);
  
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    
    const thaiDate = date.toLocaleDateString('th-TH', options);
    return thaiDate;
  };

  const getRandomWish = () => {
    const wishes = [
      "น้ำเย็นแค่ทำให้ตัวเปียก แต่รอยยิ้มเธอทำให้ใจละลาย!🫠🔥",
      "สงกรานต์นี้ขอขันเดียว… ขันหมากจากเธอได้มั้ย?💍😜",
      "สาดน้ำมันเชย สาดรักมาทางนี้เลยดีกว่า!💕💦",
      "เล่นน้ำต้องระวังเปียก แต่ถ้าเธอมาแจกใจก็พร้อมเปียกทั้งตัว!😘💖",
      "สงกรานต์นี้ไม่อยากโดนสาดน้ำ ขอโดนสาดใจแทนได้ป่ะ?💦❤️",
      "สงกรานต์ปีนี้ สาดน้ำให้ชุ่มฉ่ำ หรือสาดใจให้ชุ่มชื้นดีล่ะ?😘💖",
      "ถ้าเหงาให้ไปเล่นน้ำ แต่ถ้าอยากมีแฟนให้ทักแชทมา!📲💬",
      "สาดน้ำระวังเปียก สาดรักระวังติดใจนะ! 💦❤️",
      "สงกรานต์นี้ไม่ต้องสาดน้ำ สาดเลขบัญชีมาก็พอ!💸🤣",
      "เปียกน้ำไม่ว่า แต่เปียกแบงค์พันจะดีกว่า! 💦💰",
    ];
    return wishes[Math.floor(Math.random() * wishes.length)];
  };

  if (loading) {
    return <div className="loading">กำลังโหลดข้อมูล... 🌊</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className={`results-container ${splashEffect ? 'water-effect' : ''}`}>
      <h1>Collector Results</h1>
      <table className="songkran-table">
        <thead>
          <tr>
            <th className="id-column">ลำดับ</th>
            <th className="message-column">ผลลัพธ์</th>
            <th className="time-column">เวลารับข้อมูล</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.id}>
              <td className="id-column">{result.id}</td>
              <td className="message-column">{result.message + " (" + getRandomWish() + ")"}</td>
              <td className="time-column">
                <span className="time-icon"></span>
                {formatThaiDate(result.received_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button className="water-splash-button" onClick={handleWaterSplash}>
        คลิ๊กเพื่อสาดน้ำ!💦
      </button>
      
      <p style={{
        textAlign: 'center',
        marginTop: '20px',
        color: '#0277bd',
        fontWeight: 'bold',
        fontSize: '1.1rem'
      }}>
        สวัสดีปีใหม่ไทย ขอให้มีความสุขและโชคดีตลอดปี
      </p>
    </div>
  );
};

export default App;
