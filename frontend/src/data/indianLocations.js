/**
 * Major Indian cities/districts — grouped by state.
 * Coordinates (lat/lng) are used to call the Open-Meteo API.
 *
 * API used: https://open-meteo.com  (FREE, no API key needed)
 * Endpoint: https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}
 *            &current=temperature_2m,relative_humidity_2m,precipitation
 *            &hourly=soil_moisture_0_to_1cm
 *            &timezone=Asia/Kolkata&forecast_days=1
 */

export const INDIAN_LOCATIONS = [
  /* ── Punjab ── */
  { city: 'Ludhiana',          state: 'Punjab',            lat: 30.9010, lng: 75.8573 },
  { city: 'Amritsar',          state: 'Punjab',            lat: 31.6340, lng: 74.8723 },
  { city: 'Jalandhar',         state: 'Punjab',            lat: 31.3260, lng: 75.5762 },
  { city: 'Chandigarh',        state: 'Punjab',            lat: 30.7333, lng: 76.7794 },
  { city: 'Patiala',           state: 'Punjab',            lat: 30.3398, lng: 76.3869 },

  /* ── Haryana ── */
  { city: 'Hisar',             state: 'Haryana',           lat: 29.1492, lng: 75.7217 },
  { city: 'Karnal',            state: 'Haryana',           lat: 29.6857, lng: 76.9905 },
  { city: 'Rohtak',            state: 'Haryana',           lat: 28.8955, lng: 76.6066 },
  { city: 'Gurugram',          state: 'Haryana',           lat: 28.4595, lng: 77.0266 },

  /* ── Delhi ── */
  { city: 'New Delhi',         state: 'Delhi',             lat: 28.6139, lng: 77.2090 },

  /* ── Uttar Pradesh ── */
  { city: 'Lucknow',           state: 'Uttar Pradesh',     lat: 26.8467, lng: 80.9462 },
  { city: 'Agra',              state: 'Uttar Pradesh',     lat: 27.1767, lng: 78.0081 },
  { city: 'Varanasi',          state: 'Uttar Pradesh',     lat: 25.3176, lng: 82.9739 },
  { city: 'Kanpur',            state: 'Uttar Pradesh',     lat: 26.4499, lng: 80.3319 },
  { city: 'Meerut',            state: 'Uttar Pradesh',     lat: 28.9845, lng: 77.7064 },
  { city: 'Allahabad',         state: 'Uttar Pradesh',     lat: 25.4358, lng: 81.8463 },
  { city: 'Gorakhpur',         state: 'Uttar Pradesh',     lat: 26.7606, lng: 83.3732 },

  /* ── Rajasthan ── */
  { city: 'Jaipur',            state: 'Rajasthan',         lat: 26.9124, lng: 75.7873 },
  { city: 'Jodhpur',           state: 'Rajasthan',         lat: 26.2389, lng: 73.0243 },
  { city: 'Udaipur',           state: 'Rajasthan',         lat: 24.5854, lng: 73.7125 },
  { city: 'Kota',              state: 'Rajasthan',         lat: 25.2138, lng: 75.8648 },
  { city: 'Bikaner',           state: 'Rajasthan',         lat: 28.0229, lng: 73.3119 },

  /* ── Madhya Pradesh ── */
  { city: 'Bhopal',            state: 'Madhya Pradesh',    lat: 23.2599, lng: 77.4126 },
  { city: 'Indore',            state: 'Madhya Pradesh',    lat: 22.7196, lng: 75.8577 },
  { city: 'Jabalpur',          state: 'Madhya Pradesh',    lat: 23.1815, lng: 79.9864 },
  { city: 'Gwalior',           state: 'Madhya Pradesh',    lat: 26.2183, lng: 78.1828 },
  { city: 'Ujjain',            state: 'Madhya Pradesh',    lat: 23.1765, lng: 75.7885 },

  /* ── Chhattisgarh ── */
  { city: 'Raipur',            state: 'Chhattisgarh',      lat: 21.2514, lng: 81.6296 },
  { city: 'Bilaspur',          state: 'Chhattisgarh',      lat: 22.0796, lng: 82.1391 },

  /* ── Uttarakhand ── */
  { city: 'Dehradun',          state: 'Uttarakhand',       lat: 30.3165, lng: 78.0322 },
  { city: 'Haridwar',          state: 'Uttarakhand',       lat: 29.9457, lng: 78.1642 },

  /* ── Bihar ── */
  { city: 'Patna',             state: 'Bihar',             lat: 25.5941, lng: 85.1376 },
  { city: 'Gaya',              state: 'Bihar',             lat: 24.7914, lng: 85.0002 },
  { city: 'Muzaffarpur',       state: 'Bihar',             lat: 26.1209, lng: 85.3647 },
  { city: 'Bhagalpur',         state: 'Bihar',             lat: 25.2425, lng: 86.9842 },

  /* ── Jharkhand ── */
  { city: 'Ranchi',            state: 'Jharkhand',         lat: 23.3441, lng: 85.3096 },
  { city: 'Jamshedpur',        state: 'Jharkhand',         lat: 22.8046, lng: 86.2029 },

  /* ── West Bengal ── */
  { city: 'Kolkata',           state: 'West Bengal',       lat: 22.5726, lng: 88.3639 },
  { city: 'Siliguri',          state: 'West Bengal',       lat: 26.7271, lng: 88.3953 },
  { city: 'Asansol',           state: 'West Bengal',       lat: 23.6850, lng: 86.9831 },
  { city: 'Bardhaman',         state: 'West Bengal',       lat: 23.2324, lng: 87.8615 },

  /* ── Odisha ── */
  { city: 'Bhubaneswar',       state: 'Odisha',            lat: 20.2961, lng: 85.8245 },
  { city: 'Cuttack',           state: 'Odisha',            lat: 20.4625, lng: 85.8830 },
  { city: 'Sambalpur',         state: 'Odisha',            lat: 21.4669, lng: 83.9756 },

  /* ── Assam ── */
  { city: 'Guwahati',          state: 'Assam',             lat: 26.1445, lng: 91.7362 },
  { city: 'Dibrugarh',         state: 'Assam',             lat: 27.4728, lng: 94.9120 },

  /* ── Gujarat ── */
  { city: 'Ahmedabad',         state: 'Gujarat',           lat: 23.0225, lng: 72.5714 },
  { city: 'Surat',             state: 'Gujarat',           lat: 21.1702, lng: 72.8311 },
  { city: 'Vadodara',          state: 'Gujarat',           lat: 22.3072, lng: 73.1812 },
  { city: 'Rajkot',            state: 'Gujarat',           lat: 22.3039, lng: 70.8022 },
  { city: 'Junagadh',          state: 'Gujarat',           lat: 21.5222, lng: 70.4579 },
  { city: 'Anand',             state: 'Gujarat',           lat: 22.5645, lng: 72.9289 },

  /* ── Maharashtra ── */
  { city: 'Mumbai',            state: 'Maharashtra',       lat: 19.0760, lng: 72.8777 },
  { city: 'Pune',              state: 'Maharashtra',       lat: 18.5204, lng: 73.8567 },
  { city: 'Nagpur',            state: 'Maharashtra',       lat: 21.1458, lng: 79.0882 },
  { city: 'Nashik',            state: 'Maharashtra',       lat: 19.9975, lng: 73.7898 },
  { city: 'Aurangabad',        state: 'Maharashtra',       lat: 19.8762, lng: 75.3433 },
  { city: 'Solapur',           state: 'Maharashtra',       lat: 17.6868, lng: 75.9064 },
  { city: 'Kolhapur',          state: 'Maharashtra',       lat: 16.7050, lng: 74.2433 },
  { city: 'Amravati',          state: 'Maharashtra',       lat: 20.9374, lng: 77.7796 },

  /* ── Telangana ── */
  { city: 'Hyderabad',         state: 'Telangana',         lat: 17.3850, lng: 78.4867 },
  { city: 'Warangal',          state: 'Telangana',         lat: 17.9689, lng: 79.5941 },
  { city: 'Nizamabad',         state: 'Telangana',         lat: 18.6725, lng: 78.0941 },
  { city: 'Karimnagar',        state: 'Telangana',         lat: 18.4386, lng: 79.1288 },

  /* ── Andhra Pradesh ── */
  { city: 'Visakhapatnam',     state: 'Andhra Pradesh',    lat: 17.6868, lng: 83.2185 },
  { city: 'Vijayawada',        state: 'Andhra Pradesh',    lat: 16.5062, lng: 80.6480 },
  { city: 'Guntur',            state: 'Andhra Pradesh',    lat: 16.3067, lng: 80.4365 },
  { city: 'Kurnool',           state: 'Andhra Pradesh',    lat: 15.8281, lng: 78.0373 },
  { city: 'Tirupati',          state: 'Andhra Pradesh',    lat: 13.6288, lng: 79.4192 },
  { city: 'Nellore',           state: 'Andhra Pradesh',    lat: 14.4426, lng: 79.9865 },

  /* ── Karnataka ── */
  { city: 'Bangalore',         state: 'Karnataka',         lat: 12.9716, lng: 77.5946 },
  { city: 'Mysore',            state: 'Karnataka',         lat: 12.2958, lng: 76.6394 },
  { city: 'Hubli',             state: 'Karnataka',         lat: 15.3647, lng: 75.1240 },
  { city: 'Mangalore',         state: 'Karnataka',         lat: 12.9141, lng: 74.8560 },
  { city: 'Belgaum',           state: 'Karnataka',         lat: 15.8497, lng: 74.4977 },
  { city: 'Davangere',         state: 'Karnataka',         lat: 14.4644, lng: 75.9218 },
  { city: 'Shivamogga',        state: 'Karnataka',         lat: 13.9299, lng: 75.5681 },

  /* ── Tamil Nadu ── */
  { city: 'Chennai',           state: 'Tamil Nadu',        lat: 13.0827, lng: 80.2707 },
  { city: 'Coimbatore',        state: 'Tamil Nadu',        lat: 11.0168, lng: 76.9558 },
  { city: 'Madurai',           state: 'Tamil Nadu',        lat:  9.9252, lng: 78.1198 },
  { city: 'Tiruchirappalli',   state: 'Tamil Nadu',        lat: 10.7905, lng: 78.7047 },
  { city: 'Salem',             state: 'Tamil Nadu',        lat: 11.6643, lng: 78.1460 },
  { city: 'Tirunelveli',       state: 'Tamil Nadu',        lat:  8.7139, lng: 77.7567 },
  { city: 'Thanjavur',         state: 'Tamil Nadu',        lat: 10.7870, lng: 79.1378 },
  { city: 'Erode',             state: 'Tamil Nadu',        lat: 11.3410, lng: 77.7172 },

  /* ── Kerala ── */
  { city: 'Thiruvananthapuram',state: 'Kerala',            lat:  8.5241, lng: 76.9366 },
  { city: 'Kochi',             state: 'Kerala',            lat:  9.9312, lng: 76.2673 },
  { city: 'Kozhikode',         state: 'Kerala',            lat: 11.2588, lng: 75.7804 },
  { city: 'Thrissur',          state: 'Kerala',            lat: 10.5276, lng: 76.2144 },
  { city: 'Kollam',            state: 'Kerala',            lat:  8.8932, lng: 76.6141 },

  /* ── Himachal Pradesh ── */
  { city: 'Shimla',            state: 'Himachal Pradesh',  lat: 31.1048, lng: 77.1734 },
  { city: 'Dharamsala',        state: 'Himachal Pradesh',  lat: 32.2190, lng: 76.3234 },

  /* ── Jammu & Kashmir ── */
  { city: 'Srinagar',          state: 'Jammu & Kashmir',   lat: 34.0837, lng: 74.7973 },
  { city: 'Jammu',             state: 'Jammu & Kashmir',   lat: 32.7266, lng: 74.8570 },

  /* ── Goa ── */
  { city: 'Panaji',            state: 'Goa',               lat: 15.4989, lng: 73.8278 },
];
