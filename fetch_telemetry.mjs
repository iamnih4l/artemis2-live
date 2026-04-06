import https from 'https';
import fs from 'fs';

// Launch time of Artemis I: Nov 16, 2022 06:47:44 UTC
const START_TIME = new Date('2022-11-16T06:48:00Z').getTime();

// Function to fetch JPL Horizons data
function fetchHorizons(center) {
  return new Promise((resolve, reject) => {
    // Target is -121 (Orion Artemis 1)
    const url = `https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='-121'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='VECTORS'&CENTER='${center}'&START_TIME='2022-11-16 06:48'&STOP_TIME='2022-12-11'&STEP_SIZE='1 h'`;
    
    https.get(url, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function parseVectors(data) {
  const lines = data.split('\n');
  let inData = false;
  const points = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '$$SOE') {
      inData = true;
      continue;
    }
    if (line === '$$EOE') {
      inData = false;
      continue;
    }
    if (inData) {
      if (line.match(/^[0-9.]+\s*=\s*A.D./)) {
        // e.g. "2459899.783333333 = A.D. 2022-Nov-16 06:48:00.0000 TDB "
        const dateStrMatch = line.match(/A.D.\s+(.*?)\s+TDB/);
        if (dateStrMatch) {
          const dateStr = dateStrMatch[1] + ' UTC'; // treat TDB as UTC approx for our purposes
          const dt = new Date(dateStr.replace('Jan', '01').replace('Feb', '02').replace('Mar','03').replace('Apr','04').replace('May','05').replace('Jun','06').replace('Jul','07').replace('Aug','08').replace('Sep','09').replace('Oct','10').replace('Nov','11').replace('Dec','12')).getTime();
          const t = Math.floor((dt - START_TIME) / 1000); // seconds since launch
          
          // Next line is X Y Z
          const xyzLine = lines[i+1];
          // After that is VX VY VZ
          const vxyzLine = lines[i+2];
          
          const getVal = (str, label) => {
            const match = str.match(new RegExp(`${label}\\s*=\\s*(-?[0-9.E+-]+)`));
            return match ? parseFloat(match[1]) : 0;
          };
          
          const x = getVal(xyzLine, 'X');
          const y = getVal(xyzLine, 'Y');
          const z = getVal(xyzLine, 'Z');
          const vx = getVal(vxyzLine, 'VX');
          const vy = getVal(vxyzLine, 'VY');
          const vz = getVal(vxyzLine, 'VZ');
          
          const distance = Math.sqrt(x*x + y*y + z*z); // km
          const velocity = Math.sqrt(vx*vx + vy*vy + vz*vz) * 3600; // km/s to km/h
          
          points.push({ t, distance, velocity });
        }
      }
    }
  }
  return points;
}

async function run() {
  console.log("Fetching Earth Centered data...");
  const earthDataRaw = await fetchHorizons('500@399'); // Earth
  console.log("Fetching Moon Centered data...");
  const moonDataRaw = await fetchHorizons('500@301'); // Moon
  
  const earthPoints = parseVectors(earthDataRaw);
  const moonPoints = parseVectors(moonDataRaw);
  
  const combined = earthPoints.map((ep, i) => {
    return {
      t: ep.t,
      velocity: ep.velocity,
      distanceEarth: ep.distance,
      distanceMoon: moonPoints[i] ? moonPoints[i].distance : 384400
    };
  });
  
  fs.writeFileSync('./public/telemetry.json', JSON.stringify(combined, null, 2));
  console.log("Saved public/telemetry.json with", combined.length, "data points");
}

run().catch(console.error);
