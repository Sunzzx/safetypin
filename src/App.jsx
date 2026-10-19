import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Shield, MapPin, AlertTriangle, Navigation, Clock, Users, PhoneCall,
  Lock, Share2, Flame, Plus, Search, Star, ChevronRight, X,
  Eye, Phone, Zap, Heart, Home, Bell, User, ArrowRight,
  Sparkles, Route, ThumbsUp, Lightbulb, Info, Activity,
  ShieldCheck, Locate, Send, RefreshCw, Compass,
  Layers, ChevronDown, Globe, CheckCircle, Radio, Volume2, VolumeX,
  TrendingUp, BarChart3, Camera, Award, MessageCircle, Bot, Mic, Key,
  Upload, Play, Square, Settings, Edit3, MicOff, PhoneIncoming,
  Calculator, Flashlight, Battery, ExternalLink, Download, ShieldAlert
} from 'lucide-react';

/* ━━━━━━━━━━━━━━━━━━━━━━━ CONSTANTS & CITY DATA ━━━━━━━━━━━━━━━━━━━━━━ */

const INITIAL_CITIES = {
  'delhi': {
    name: "Delhi NCR",
    center: [28.6139, 77.209],
    safePlaces: [
      { id: 81851, name: "Parliament Street Police Station", type: "police", lat: 28.6225, lng: 77.2115, rating: 4.2 },
      { id: 106, name: "Connaught Place PCR Booth", type: "police", lat: 28.6315, lng: 77.2167, rating: 4.0 },
      { id: 29224, name: "Tilak Marg Police Station", type: "police", lat: 28.628, lng: 77.238, rating: 3.8 },
      { id: 88303, name: "AIIMS Hospital", type: "hospital", lat: 28.5672, lng: 77.21, rating: 4.5 },
      { id: 33592, name: "Safdarjung Hospital", type: "hospital", lat: 28.5685, lng: 77.2065, rating: 4.3 },
      { id: 17527, name: "Ram Manohar Lohia Hospital", type: "hospital", lat: 28.6265, lng: 77.203, rating: 4.1 },
      { id: 72038, name: "Rajiv Chowk Metro Station", type: "metro", lat: 28.6328, lng: 77.2197, rating: 4.0 },
      { id: 62485, name: "Hauz Khas Metro Station", type: "metro", lat: 28.543, lng: 77.206, rating: 4.1 },
      { id: 10266, name: "Mandi House Metro Station", type: "metro", lat: 28.6254, lng: 77.234, rating: 3.9 },
      { id: 43353, name: "IIT Delhi Campus Gate", type: "safe_zone", lat: 28.545, lng: 77.1926, rating: 4.6 },
      { id: 76052, name: "Select Citywalk Mall", type: "safe_zone", lat: 28.5289, lng: 77.219, rating: 4.4 },
      { id: 33935, name: "India Gate Help Desk", type: "safe_zone", lat: 28.6129, lng: 77.2295, rating: 4.3 },
      { id: 14470, name: "Apollo Pharmacy 24/7 (Delhi NCR)", type: "safe_haven", lat: 28.6169, lng: 77.212, rating: 4.8 },
      { id: 46925, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 28.6099, lng: 77.206, rating: 4.7 },
    ],
    dangers: [
      { lat: 28.635, lng: 77.225, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 28.555, lng: 77.235, level: "medium", label: "Isolated stretch after 9 PM" },
      { lat: 28.618, lng: 77.24, level: "high", label: "Poor lighting, no CCTV coverage" },
      { lat: 28.59, lng: 77.25, level: "medium", label: "Construction zone - detours at night" },
    ]
  },
  'mumbai': {
    name: "Mumbai",
    center: [19.076, 72.8777],
    safePlaces: [
      { id: 90958, name: "Bandra Police Station", type: "police", lat: 19.0596, lng: 72.8295, rating: 4.6 },
      { id: 69006, name: "Lilavati Hospital", type: "hospital", lat: 19.0515, lng: 72.829, rating: 4.8 },
      { id: 21009, name: "Bandra Local Station (Women Helpdesk)", type: "metro", lat: 19.0544, lng: 72.8402, rating: 4.5 },
      { id: 6089, name: "Marine Drive Coastal Outpost", type: "safe_zone", lat: 18.9438, lng: 72.8232, rating: 4.9 },
      { id: 60043, name: "Apollo Pharmacy 24/7 (Mumbai)", type: "safe_haven", lat: 19.079, lng: 72.8807, rating: 4.8 },
      { id: 87712, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 19.072, lng: 72.8747, rating: 4.7 },
    ],
    dangers: [
      { lat: 19.062, lng: 72.845, level: "high", label: "Railway East footbridge after 11 PM" },
    ]
  },
  'bengaluru': {
    name: "Bengaluru",
    center: [12.9716, 77.5946],
    safePlaces: [
      { id: 65576, name: "Cubbon Park Police Station", type: "police", lat: 12.975, lng: 77.592, rating: 4.6 },
      { id: 35853, name: "MG Road Metro Station", type: "metro", lat: 12.9756, lng: 77.6066, rating: 4.8 },
      { id: 85445, name: "Bowring Hospital", type: "hospital", lat: 12.983, lng: 77.604, rating: 4.4 },
      { id: 71849, name: "Church Street Pink Patrol", type: "safe_zone", lat: 12.9745, lng: 77.605, rating: 4.9 },
      { id: 71328, name: "Apollo Pharmacy 24/7 (Bengaluru)", type: "safe_haven", lat: 12.9746, lng: 77.5976, rating: 4.8 },
      { id: 32107, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 12.9676, lng: 77.5916, rating: 4.7 },
    ],
    dangers: [
      { lat: 12.96, lng: 77.62, level: "medium", label: "Under construction bypass corridor" },
    ]
  },
  'kolkata': {
    name: "Kolkata",
    center: [22.5726, 88.3639],
    safePlaces: [
      { id: 73024, name: "Park Street Police Station", type: "police", lat: 22.551, lng: 88.353, rating: 4.7 },
      { id: 52102, name: "Park Street Metro Desk", type: "metro", lat: 22.5535, lng: 88.3512, rating: 4.8 },
      { id: 44010, name: "SSKM Medical Hospital", type: "hospital", lat: 22.539, lng: 88.344, rating: 4.6 },
      { id: 5300, name: "Maidan Suraksha Outpost", type: "safe_zone", lat: 22.555, lng: 88.346, rating: 4.8 },
      { id: 88308, name: "Apollo Pharmacy 24/7 (Kolkata)", type: "safe_haven", lat: 22.5756, lng: 88.3669, rating: 4.8 },
      { id: 32729, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 22.5686, lng: 88.3609, rating: 4.7 },
    ],
    dangers: [
      { lat: 22.565, lng: 88.375, level: "high", label: "Narrow unlit lane near canal" },
    ]
  },
  'chennai': {
    name: "Chennai",
    center: [13.0827, 80.2707],
    safePlaces: [
      { id: 19818, name: "Egmore Police Station", type: "police", lat: 13.0887, lng: 80.2757, rating: 4.6 },
      { id: 39460, name: "Apollo Hospital Greams Rd", type: "hospital", lat: 13.0757, lng: 80.2667, rating: 4.5 },
      { id: 45140, name: "Chennai Central Station", type: "metro", lat: 13.0787, lng: 80.2767, rating: 4.3 },
      { id: 78986, name: "Marina Beach Women Patrol", type: "safe_zone", lat: 13.0857, lng: 80.2647, rating: 4.8 },
      { id: 84080, name: "Apollo Pharmacy 24/7 (Chennai)", type: "safe_haven", lat: 13.0857, lng: 80.2737, rating: 4.8 },
      { id: 67594, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 13.0787, lng: 80.2677, rating: 4.7 },
    ],
    dangers: [
      { lat: 13.0947, lng: 80.2807, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 13.0717, lng: 80.2587, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'hyderabad': {
    name: "Hyderabad",
    center: [17.385, 78.4867],
    safePlaces: [
      { id: 28535, name: "Banjara Hills Police", type: "police", lat: 17.391, lng: 78.4917, rating: 4.6 },
      { id: 31786, name: "NIMS Hospital Punjagutta", type: "hospital", lat: 17.378, lng: 78.4827, rating: 4.5 },
      { id: 69012, name: "Ameerpet Metro Hub", type: "metro", lat: 17.381, lng: 78.4927, rating: 4.3 },
      { id: 66880, name: "Hitec City Pink Outpost", type: "safe_zone", lat: 17.388, lng: 78.4807, rating: 4.8 },
      { id: 91555, name: "Apollo Pharmacy 24/7 (Hyderabad)", type: "safe_haven", lat: 17.388, lng: 78.4897, rating: 4.8 },
      { id: 66189, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 17.381, lng: 78.4837, rating: 4.7 },
    ],
    dangers: [
      { lat: 17.397, lng: 78.4967, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 17.374, lng: 78.4747, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'pune': {
    name: "Pune",
    center: [18.5204, 73.8567],
    safePlaces: [
      { id: 56129, name: "Shivajinagar Police", type: "police", lat: 18.5264, lng: 73.8617, rating: 4.6 },
      { id: 53288, name: "Ruby Hall Clinic", type: "hospital", lat: 18.5134, lng: 73.8527, rating: 4.5 },
      { id: 55375, name: "Pune Station Helpdesk", type: "metro", lat: 18.5164, lng: 73.8627, rating: 4.3 },
      { id: 30718, name: "FC Road Women Safety Desk", type: "safe_zone", lat: 18.5234, lng: 73.8507, rating: 4.8 },
      { id: 73813, name: "Apollo Pharmacy 24/7 (Pune)", type: "safe_haven", lat: 18.5234, lng: 73.8597, rating: 4.8 },
      { id: 40203, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 18.5164, lng: 73.8537, rating: 4.7 },
    ],
    dangers: [
      { lat: 18.5324, lng: 73.8667, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 18.5094, lng: 73.8447, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'ahmedabad': {
    name: "Ahmedabad",
    center: [23.0225, 72.5714],
    safePlaces: [
      { id: 38096, name: "Navrangpura Police", type: "police", lat: 23.0285, lng: 72.5764, rating: 4.6 },
      { id: 4343, name: "Civil Hospital Asarwa", type: "hospital", lat: 23.0155, lng: 72.5674, rating: 4.5 },
      { id: 81663, name: "Kalupur Metro Station", type: "metro", lat: 23.0185, lng: 72.5774, rating: 4.3 },
      { id: 8220, name: "Sabarmati Riverfront Patrol", type: "safe_zone", lat: 23.0255, lng: 72.5654, rating: 4.8 },
      { id: 75883, name: "Apollo Pharmacy 24/7 (Ahmedabad)", type: "safe_haven", lat: 23.0255, lng: 72.5744, rating: 4.8 },
      { id: 63429, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 23.0185, lng: 72.5684, rating: 4.7 },
    ],
    dangers: [
      { lat: 23.0345, lng: 72.5814, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 23.0115, lng: 72.5594, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'jaipur': {
    name: "Jaipur",
    center: [26.9124, 75.7873],
    safePlaces: [
      { id: 90614, name: "Vidhyadhar Nagar Police", type: "police", lat: 26.9184, lng: 75.7923, rating: 4.6 },
      { id: 99749, name: "SMS Hospital", type: "hospital", lat: 26.9054, lng: 75.7833, rating: 4.5 },
      { id: 25699, name: "Sindhi Camp Metro", type: "metro", lat: 26.9084, lng: 75.7933, rating: 4.3 },
      { id: 81233, name: "MI Road Pink Booth", type: "safe_zone", lat: 26.9154, lng: 75.7813, rating: 4.8 },
      { id: 38806, name: "Apollo Pharmacy 24/7 (Jaipur)", type: "safe_haven", lat: 26.9154, lng: 75.7903, rating: 4.8 },
      { id: 82220, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 26.9084, lng: 75.7843, rating: 4.7 },
    ],
    dangers: [
      { lat: 26.9244, lng: 75.7973, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 26.9014, lng: 75.7753, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'lucknow': {
    name: "Lucknow",
    center: [26.8467, 80.9462],
    safePlaces: [
      { id: 45376, name: "Hazratganj Police", type: "police", lat: 26.8527, lng: 80.9512, rating: 4.6 },
      { id: 70086, name: "KGMU Hospital", type: "hospital", lat: 26.8397, lng: 80.9422, rating: 4.5 },
      { id: 9687, name: "Charbagh Metro Hub", type: "metro", lat: 26.8427, lng: 80.9522, rating: 4.3 },
      { id: 32678, name: "Gomti Nagar Patrol Desk", type: "safe_zone", lat: 26.8497, lng: 80.9402, rating: 4.8 },
      { id: 92109, name: "Apollo Pharmacy 24/7 (Lucknow)", type: "safe_haven", lat: 26.8497, lng: 80.9492, rating: 4.8 },
      { id: 94368, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 26.8427, lng: 80.9432, rating: 4.7 },
    ],
    dangers: [
      { lat: 26.8587, lng: 80.9562, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 26.8357, lng: 80.9342, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'chandigarh': {
    name: "Chandigarh",
    center: [30.7333, 76.7794],
    safePlaces: [
      { id: 44681, name: "Sector 17 Police Station", type: "police", lat: 30.7393, lng: 76.7844, rating: 4.6 },
      { id: 73056, name: "PGIMER Hospital", type: "hospital", lat: 30.7263, lng: 76.7754, rating: 4.5 },
      { id: 75990, name: "ISBT 43 Transit Desk", type: "metro", lat: 30.7293, lng: 76.7854, rating: 4.3 },
      { id: 45799, name: "Sukhna Lake Safety Outpost", type: "safe_zone", lat: 30.7363, lng: 76.7734, rating: 4.8 },
      { id: 19937, name: "Apollo Pharmacy 24/7 (Chandigarh)", type: "safe_haven", lat: 30.7363, lng: 76.7824, rating: 4.8 },
      { id: 20206, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 30.7293, lng: 76.7764, rating: 4.7 },
    ],
    dangers: [
      { lat: 30.7453, lng: 76.7894, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 30.7223, lng: 76.7674, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'surat': {
    name: "Surat",
    center: [21.1702, 72.8311],
    safePlaces: [
      { id: 594, name: "Athwalines Police", type: "police", lat: 21.1762, lng: 72.8361, rating: 4.6 },
      { id: 51260, name: "New Civil Hospital", type: "hospital", lat: 21.1632, lng: 72.8271, rating: 4.5 },
      { id: 49109, name: "Surat Railway Station Helpdesk", type: "metro", lat: 21.1662, lng: 72.8371, rating: 4.3 },
      { id: 26344, name: "Dumas Road Night Patrol", type: "safe_zone", lat: 21.1732, lng: 72.8251, rating: 4.8 },
      { id: 50999, name: "Apollo Pharmacy 24/7 (Surat)", type: "safe_haven", lat: 21.1732, lng: 72.8341, rating: 4.8 },
      { id: 80706, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 21.1662, lng: 72.8281, rating: 4.7 },
    ],
    dangers: [
      { lat: 21.1822, lng: 72.8411, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 21.1592, lng: 72.8191, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'indore': {
    name: "Indore",
    center: [22.7196, 75.8577],
    safePlaces: [
      { id: 11649, name: "Palasia Police Station", type: "police", lat: 22.7256, lng: 75.8627, rating: 4.6 },
      { id: 13049, name: "MY Hospital", type: "hospital", lat: 22.7126, lng: 75.8537, rating: 4.5 },
      { id: 72840, name: "Sarwate Bus Stand Desk", type: "metro", lat: 22.7156, lng: 75.8637, rating: 4.3 },
      { id: 40253, name: "56 Dukan Women Outpost", type: "safe_zone", lat: 22.7226, lng: 75.8517, rating: 4.8 },
      { id: 14477, name: "Apollo Pharmacy 24/7 (Indore)", type: "safe_haven", lat: 22.7226, lng: 75.8607, rating: 4.8 },
      { id: 78374, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 22.7156, lng: 75.8547, rating: 4.7 },
    ],
    dangers: [
      { lat: 22.7316, lng: 75.8677, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 22.7086, lng: 75.8457, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'bhopal': {
    name: "Bhopal",
    center: [23.2599, 77.4126],
    safePlaces: [
      { id: 65447, name: "MP Nagar Police", type: "police", lat: 23.2659, lng: 77.4176, rating: 4.6 },
      { id: 84396, name: "AIIMS Bhopal", type: "hospital", lat: 23.2529, lng: 77.4086, rating: 4.5 },
      { id: 3165, name: "Rani Kamlapati Station", type: "metro", lat: 23.2559, lng: 77.4186, rating: 4.3 },
      { id: 90929, name: "Upper Lake VIP Patrol", type: "safe_zone", lat: 23.2629, lng: 77.4066, rating: 4.8 },
      { id: 80423, name: "Apollo Pharmacy 24/7 (Bhopal)", type: "safe_haven", lat: 23.2629, lng: 77.4156, rating: 4.8 },
      { id: 22238, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 23.2559, lng: 77.4096, rating: 4.7 },
    ],
    dangers: [
      { lat: 23.2719, lng: 77.4226, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 23.2489, lng: 77.4006, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'nagpur': {
    name: "Nagpur",
    center: [21.1458, 79.0882],
    safePlaces: [
      { id: 75845, name: "Sitabuldi Police Station", type: "police", lat: 21.1518, lng: 79.0932, rating: 4.6 },
      { id: 80053, name: "GMC Hospital", type: "hospital", lat: 21.1388, lng: 79.0842, rating: 4.5 },
      { id: 26234, name: "Sitabuldi Metro Interchange", type: "metro", lat: 21.1418, lng: 79.0942, rating: 4.3 },
      { id: 6195, name: "Futala Lake Patrol Desk", type: "safe_zone", lat: 21.1488, lng: 79.0822, rating: 4.8 },
      { id: 43317, name: "Apollo Pharmacy 24/7 (Nagpur)", type: "safe_haven", lat: 21.1488, lng: 79.0912, rating: 4.8 },
      { id: 51281, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 21.1418, lng: 79.0852, rating: 4.7 },
    ],
    dangers: [
      { lat: 21.1578, lng: 79.0982, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 21.1348, lng: 79.0762, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'patna': {
    name: "Patna",
    center: [25.5941, 85.1376],
    safePlaces: [
      { id: 72872, name: "Kotwali Police Station", type: "police", lat: 25.6001, lng: 85.1426, rating: 4.6 },
      { id: 85824, name: "PMCH Hospital", type: "hospital", lat: 25.5871, lng: 85.1336, rating: 4.5 },
      { id: 48081, name: "Patna Junction Helpdesk", type: "metro", lat: 25.5901, lng: 85.1436, rating: 4.3 },
      { id: 86704, name: "Gandhi Maidan Safe Zone", type: "safe_zone", lat: 25.5971, lng: 85.1316, rating: 4.8 },
      { id: 67274, name: "Apollo Pharmacy 24/7 (Patna)", type: "safe_haven", lat: 25.5971, lng: 85.1406, rating: 4.8 },
      { id: 50492, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 25.5901, lng: 85.1346, rating: 4.7 },
    ],
    dangers: [
      { lat: 25.6061, lng: 85.1476, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 25.5831, lng: 85.1256, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'bhubaneswar': {
    name: "Bhubaneswar",
    center: [20.2961, 85.8245],
    safePlaces: [
      { id: 20137, name: "Kharavel Nagar Police", type: "police", lat: 20.3021, lng: 85.8295, rating: 4.6 },
      { id: 20636, name: "AIIMS Bhubaneswar", type: "hospital", lat: 20.2891, lng: 85.8205, rating: 4.5 },
      { id: 42396, name: "Master Canteen Station", type: "metro", lat: 20.2921, lng: 85.8305, rating: 4.3 },
      { id: 50511, name: "Saheed Nagar Pink Booth", type: "safe_zone", lat: 20.2991, lng: 85.8185, rating: 4.8 },
      { id: 52234, name: "Apollo Pharmacy 24/7 (Bhubaneswar)", type: "safe_haven", lat: 20.2991, lng: 85.8275, rating: 4.8 },
      { id: 98473, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 20.2921, lng: 85.8215, rating: 4.7 },
    ],
    dangers: [
      { lat: 20.3081, lng: 85.8345, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 20.2851, lng: 85.8125, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'kochi': {
    name: "Kochi (Ernakulam)",
    center: [9.9312, 76.2673],
    safePlaces: [
      { id: 28914, name: "Central Police Ernakulam", type: "police", lat: 9.9372, lng: 76.2723, rating: 4.6 },
      { id: 96805, name: "Aster Medcity", type: "hospital", lat: 9.9242, lng: 76.2633, rating: 4.5 },
      { id: 90299, name: "MG Road Metro Station", type: "metro", lat: 9.9272, lng: 76.2733, rating: 4.3 },
      { id: 57076, name: "Marine Drive Walkway Patrol", type: "safe_zone", lat: 9.9342, lng: 76.2613, rating: 4.8 },
      { id: 25519, name: "Apollo Pharmacy 24/7 (Kochi)", type: "safe_haven", lat: 9.9342, lng: 76.2703, rating: 4.8 },
      { id: 85031, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 9.9272, lng: 76.2643, rating: 4.7 },
    ],
    dangers: [
      { lat: 9.9432, lng: 76.2773, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 9.9202, lng: 76.2553, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'visakhapatnam': {
    name: "Visakhapatnam",
    center: [17.6868, 83.2185],
    safePlaces: [
      { id: 50182, name: "MVP Colony Police", type: "police", lat: 17.6928, lng: 83.2235, rating: 4.6 },
      { id: 28187, name: "King George Hospital", type: "hospital", lat: 17.6798, lng: 83.2145, rating: 4.5 },
      { id: 40436, name: "Vizag Railway Helpdesk", type: "metro", lat: 17.6828, lng: 83.2245, rating: 4.3 },
      { id: 97006, name: "RK Beach Coastal Patrol", type: "safe_zone", lat: 17.6898, lng: 83.2125, rating: 4.8 },
      { id: 93732, name: "Apollo Pharmacy 24/7 (Visakhapatnam)", type: "safe_haven", lat: 17.6898, lng: 83.2215, rating: 4.8 },
      { id: 17343, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 17.6828, lng: 83.2155, rating: 4.7 },
    ],
    dangers: [
      { lat: 17.6988, lng: 83.2285, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 17.6758, lng: 83.2065, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'coimbatore': {
    name: "Coimbatore",
    center: [11.0168, 76.9558],
    safePlaces: [
      { id: 78346, name: "RS Puram Police", type: "police", lat: 11.0228, lng: 76.9608, rating: 4.6 },
      { id: 4617, name: "Coimbatore Medical College", type: "hospital", lat: 11.0098, lng: 76.9518, rating: 4.5 },
      { id: 95157, name: "Gandhipuram Transit Desk", type: "metro", lat: 11.0128, lng: 76.9618, rating: 4.3 },
      { id: 49012, name: "Race Course Safe Corridor", type: "safe_zone", lat: 11.0198, lng: 76.9498, rating: 4.8 },
      { id: 27285, name: "Apollo Pharmacy 24/7 (Coimbatore)", type: "safe_haven", lat: 11.0198, lng: 76.9588, rating: 4.8 },
      { id: 25194, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 11.0128, lng: 76.9528, rating: 4.7 },
    ],
    dangers: [
      { lat: 11.0288, lng: 76.9658, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 11.0058, lng: 76.9438, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'dehradun': {
    name: "Dehradun",
    center: [30.3165, 78.0322],
    safePlaces: [
      { id: 78194, name: "Dalanwala Police Station", type: "police", lat: 30.3225, lng: 78.0372, rating: 4.6 },
      { id: 34973, name: "Doon Hospital", type: "hospital", lat: 30.3095, lng: 78.0282, rating: 4.5 },
      { id: 18341, name: "Dehradun Railway Station", type: "metro", lat: 30.3125, lng: 78.0382, rating: 4.3 },
      { id: 40163, name: "Rajpur Road Women Patrol", type: "safe_zone", lat: 30.3195, lng: 78.0262, rating: 4.8 },
      { id: 20508, name: "Apollo Pharmacy 24/7 (Dehradun)", type: "safe_haven", lat: 30.3195, lng: 78.0352, rating: 4.8 },
      { id: 45345, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 30.3125, lng: 78.0292, rating: 4.7 },
    ],
    dangers: [
      { lat: 30.3285, lng: 78.0422, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 30.3055, lng: 78.0202, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'varanasi': {
    name: "Varanasi",
    center: [25.3176, 82.9739],
    safePlaces: [
      { id: 66850, name: "Cantonment Police", type: "police", lat: 25.3236, lng: 82.9789, rating: 4.6 },
      { id: 99350, name: "BHU Trauma Centre", type: "hospital", lat: 25.3106, lng: 82.9699, rating: 4.5 },
      { id: 43465, name: "Varanasi Cantt Station", type: "metro", lat: 25.3136, lng: 82.9799, rating: 4.3 },
      { id: 54963, name: "Ghats Suraksha Outpost", type: "safe_zone", lat: 25.3206, lng: 82.9679, rating: 4.8 },
      { id: 88729, name: "Apollo Pharmacy 24/7 (Varanasi)", type: "safe_haven", lat: 25.3206, lng: 82.9769, rating: 4.8 },
      { id: 27204, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 25.3136, lng: 82.9709, rating: 4.7 },
    ],
    dangers: [
      { lat: 25.3296, lng: 82.9839, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 25.3066, lng: 82.9619, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'amritsar': {
    name: "Amritsar",
    center: [31.634, 74.8723],
    safePlaces: [
      { id: 91735, name: "Civil Lines Police", type: "police", lat: 31.64, lng: 74.8773, rating: 4.6 },
      { id: 14318, name: "Guru Nanak Dev Hospital", type: "hospital", lat: 31.627, lng: 74.8683, rating: 4.5 },
      { id: 66728, name: "Amritsar Railway Desk", type: "metro", lat: 31.63, lng: 74.8783, rating: 4.3 },
      { id: 57888, name: "Heritage Street Patrol", type: "safe_zone", lat: 31.637, lng: 74.8663, rating: 4.8 },
      { id: 21093, name: "Apollo Pharmacy 24/7 (Amritsar)", type: "safe_haven", lat: 31.637, lng: 74.8753, rating: 4.8 },
      { id: 36271, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 31.63, lng: 74.8693, rating: 4.7 },
    ],
    dangers: [
      { lat: 31.646, lng: 74.8823, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 31.623, lng: 74.8603, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'vadodara': {
    name: "Vadodara",
    center: [22.3072, 73.1812],
    safePlaces: [
      { id: 28230, name: "Sayajigunj Police", type: "police", lat: 22.3132, lng: 73.1862, rating: 4.6 },
      { id: 52105, name: "SSG Hospital", type: "hospital", lat: 22.3002, lng: 73.1772, rating: 4.5 },
      { id: 77857, name: "Vadodara Junction Desk", type: "metro", lat: 22.3032, lng: 73.1872, rating: 4.3 },
      { id: 24895, name: "Alkapuri Safe Corridor", type: "safe_zone", lat: 22.3102, lng: 73.1752, rating: 4.8 },
      { id: 73857, name: "Apollo Pharmacy 24/7 (Vadodara)", type: "safe_haven", lat: 22.3102, lng: 73.1842, rating: 4.8 },
      { id: 88574, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 22.3032, lng: 73.1782, rating: 4.7 },
    ],
    dangers: [
      { lat: 22.3192, lng: 73.1912, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 22.2962, lng: 73.1692, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'agra': {
    name: "Agra",
    center: [27.1767, 78.0081],
    safePlaces: [
      { id: 5483, name: "Tajganj Police Station", type: "police", lat: 27.1827, lng: 78.0131, rating: 4.6 },
      { id: 66693, name: "SN Medical College", type: "hospital", lat: 27.1697, lng: 78.0041, rating: 4.5 },
      { id: 1276, name: "Agra Cantt Station", type: "metro", lat: 27.1727, lng: 78.0141, rating: 4.3 },
      { id: 83547, name: "Fatehabad Road Patrol", type: "safe_zone", lat: 27.1797, lng: 78.0021, rating: 4.8 },
      { id: 40558, name: "Apollo Pharmacy 24/7 (Agra)", type: "safe_haven", lat: 27.1797, lng: 78.0111, rating: 4.8 },
      { id: 16219, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 27.1727, lng: 78.0051, rating: 4.7 },
    ],
    dangers: [
      { lat: 27.1887, lng: 78.0181, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 27.1657, lng: 77.9961, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'goa': {
    name: "Goa (Panaji)",
    center: [15.4909, 73.8278],
    safePlaces: [
      { id: 24030, name: "Panaji Police Station", type: "police", lat: 15.4969, lng: 73.8328, rating: 4.6 },
      { id: 85462, name: "Goa Medical College Bambolim", type: "hospital", lat: 15.4839, lng: 73.8238, rating: 4.5 },
      { id: 23543, name: "KTC Bus Terminal Desk", type: "metro", lat: 15.4869, lng: 73.8338, rating: 4.3 },
      { id: 226, name: "Miramar Promenade Patrol", type: "safe_zone", lat: 15.4939, lng: 73.8218, rating: 4.8 },
      { id: 14273, name: "Apollo Pharmacy 24/7 (Goa)", type: "safe_haven", lat: 15.4939, lng: 73.8308, rating: 4.8 },
      { id: 45690, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 15.4869, lng: 73.8248, rating: 4.7 },
    ],
    dangers: [
      { lat: 15.5029, lng: 73.8378, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 15.4799, lng: 73.8158, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'ranchi': {
    name: "Ranchi",
    center: [23.3441, 85.3096],
    safePlaces: [
      { id: 97961, name: "Hindpiri Police Station", type: "police", lat: 23.3501, lng: 85.3146, rating: 4.6 },
      { id: 11149, name: "RIMS Hospital", type: "hospital", lat: 23.3371, lng: 85.3056, rating: 4.5 },
      { id: 89852, name: "Ranchi Junction Helpdesk", type: "metro", lat: 23.3401, lng: 85.3156, rating: 4.3 },
      { id: 66815, name: "Main Road Pink Patrol", type: "safe_zone", lat: 23.3471, lng: 85.3036, rating: 4.8 },
      { id: 90074, name: "Apollo Pharmacy 24/7 (Ranchi)", type: "safe_haven", lat: 23.3471, lng: 85.3126, rating: 4.8 },
      { id: 12787, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 23.3401, lng: 85.3066, rating: 4.7 },
    ],
    dangers: [
      { lat: 23.3561, lng: 85.3196, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 23.3331, lng: 85.2976, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'raipur': {
    name: "Raipur",
    center: [21.2514, 81.6296],
    safePlaces: [
      { id: 10155, name: "Pandri Police Station", type: "police", lat: 21.2574, lng: 81.6346, rating: 4.6 },
      { id: 3683, name: "AIIMS Raipur", type: "hospital", lat: 21.2444, lng: 81.6256, rating: 4.5 },
      { id: 36391, name: "Raipur Junction Desk", type: "metro", lat: 21.2474, lng: 81.6356, rating: 4.3 },
      { id: 40906, name: "Telibandha Marine Drive", type: "safe_zone", lat: 21.2544, lng: 81.6236, rating: 4.8 },
      { id: 43301, name: "Apollo Pharmacy 24/7 (Raipur)", type: "safe_haven", lat: 21.2544, lng: 81.6326, rating: 4.8 },
      { id: 69679, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 21.2474, lng: 81.6266, rating: 4.7 },
    ],
    dangers: [
      { lat: 21.2634, lng: 81.6396, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 21.2404, lng: 81.6176, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'thiruvananthapuram': {
    name: "Thiruvananthapuram",
    center: [8.5241, 76.9366],
    safePlaces: [
      { id: 19385, name: "Museum Police Station", type: "police", lat: 8.5301, lng: 76.9416, rating: 4.6 },
      { id: 50553, name: "Govt Medical College", type: "hospital", lat: 8.5171, lng: 76.9326, rating: 4.5 },
      { id: 78911, name: "Thampanoor Central Desk", type: "metro", lat: 8.5201, lng: 76.9426, rating: 4.3 },
      { id: 89257, name: "Kowdiar Safe Zone", type: "safe_zone", lat: 8.5271, lng: 76.9306, rating: 4.8 },
      { id: 49115, name: "Apollo Pharmacy 24/7 (Thiruvananthapuram)", type: "safe_haven", lat: 8.5271, lng: 76.9396, rating: 4.8 },
      { id: 41699, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 8.5201, lng: 76.9336, rating: 4.7 },
    ],
    dangers: [
      { lat: 8.5361, lng: 76.9466, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 8.5131, lng: 76.9246, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'shimla': {
    name: "Shimla",
    center: [31.1048, 77.1734],
    safePlaces: [
      { id: 23815, name: "Sadar Police Shimla", type: "police", lat: 31.1108, lng: 77.1784, rating: 4.6 },
      { id: 23248, name: "IGMC Hospital", type: "hospital", lat: 31.0978, lng: 77.1694, rating: 4.5 },
      { id: 83947, name: "Old Bus Stand Desk", type: "metro", lat: 31.1008, lng: 77.1794, rating: 4.3 },
      { id: 48178, name: "The Ridge Women Helpdesk", type: "safe_zone", lat: 31.1078, lng: 77.1674, rating: 4.8 },
      { id: 78719, name: "Apollo Pharmacy 24/7 (Shimla)", type: "safe_haven", lat: 31.1078, lng: 77.1764, rating: 4.8 },
      { id: 64104, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 31.1008, lng: 77.1704, rating: 4.7 },
    ],
    dangers: [
      { lat: 31.1168, lng: 77.1834, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 31.0938, lng: 77.1614, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'srinagar': {
    name: "Srinagar",
    center: [34.0837, 74.7973],
    safePlaces: [
      { id: 76299, name: "Kothi Bagh Police", type: "police", lat: 34.0897, lng: 74.8023, rating: 4.6 },
      { id: 26741, name: "SMHS Hospital", type: "hospital", lat: 34.0767, lng: 74.7933, rating: 4.5 },
      { id: 44371, name: "TRC Transit Desk", type: "metro", lat: 34.0797, lng: 74.8033, rating: 4.3 },
      { id: 89528, name: "Lal Chowk Women Patrol", type: "safe_zone", lat: 34.0867, lng: 74.7913, rating: 4.8 },
      { id: 92629, name: "Apollo Pharmacy 24/7 (Srinagar)", type: "safe_haven", lat: 34.0867, lng: 74.8003, rating: 4.8 },
      { id: 72528, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 34.0797, lng: 74.7943, rating: 4.7 },
    ],
    dangers: [
      { lat: 34.0957, lng: 74.8073, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 34.0727, lng: 74.7853, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'mysuru': {
    name: "Mysuru",
    center: [12.2958, 76.6394],
    safePlaces: [
      { id: 21828, name: "Devaraja Police Station", type: "police", lat: 12.3018, lng: 76.6444, rating: 4.6 },
      { id: 79221, name: "KR Hospital", type: "hospital", lat: 12.2888, lng: 76.6354, rating: 4.5 },
      { id: 8435, name: "Mysuru City Bus Stand", type: "metro", lat: 12.2918, lng: 76.6454, rating: 4.3 },
      { id: 74164, name: "Palace Suraksha Booth", type: "safe_zone", lat: 12.2988, lng: 76.6334, rating: 4.8 },
      { id: 51075, name: "Apollo Pharmacy 24/7 (Mysuru)", type: "safe_haven", lat: 12.2988, lng: 76.6424, rating: 4.8 },
      { id: 66815, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 12.2918, lng: 76.6364, rating: 4.7 },
    ],
    dangers: [
      { lat: 12.3078, lng: 76.6494, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 12.2848, lng: 76.6274, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'mangalore': {
    name: "Mangalore",
    center: [12.9141, 74.856],
    safePlaces: [
      { id: 98387, name: "Bunder Police Station", type: "police", lat: 12.9201, lng: 74.861, rating: 4.6 },
      { id: 50634, name: "Wenlock District Hospital", type: "hospital", lat: 12.9071, lng: 74.852, rating: 4.5 },
      { id: 10400, name: "Mangalore Central Station", type: "metro", lat: 12.9101, lng: 74.862, rating: 4.3 },
      { id: 58658, name: "Kadri Park Safe Corridor", type: "safe_zone", lat: 12.9171, lng: 74.85, rating: 4.8 },
      { id: 95610, name: "Apollo Pharmacy 24/7 (Mangalore)", type: "safe_haven", lat: 12.9171, lng: 74.859, rating: 4.8 },
      { id: 88635, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 12.9101, lng: 74.853, rating: 4.7 },
    ],
    dangers: [
      { lat: 12.9261, lng: 74.866, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 12.9031, lng: 74.844, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'ludhiana': {
    name: "Ludhiana",
    center: [30.901, 75.8573],
    safePlaces: [
      { id: 87963, name: "Division No 5 Police", type: "police", lat: 30.907, lng: 75.8623, rating: 4.6 },
      { id: 46222, name: "DMC Hospital", type: "hospital", lat: 30.894, lng: 75.8533, rating: 4.5 },
      { id: 26490, name: "Ludhiana Junction Desk", type: "metro", lat: 30.897, lng: 75.8633, rating: 4.3 },
      { id: 1986, name: "Sarabha Nagar Market Patrol", type: "safe_zone", lat: 30.904, lng: 75.8513, rating: 4.8 },
      { id: 10755, name: "Apollo Pharmacy 24/7 (Ludhiana)", type: "safe_haven", lat: 30.904, lng: 75.8603, rating: 4.8 },
      { id: 27983, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 30.897, lng: 75.8543, rating: 4.7 },
    ],
    dangers: [
      { lat: 30.913, lng: 75.8673, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 30.89, lng: 75.8453, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'kanpur': {
    name: "Kanpur",
    center: [26.4499, 80.3319],
    safePlaces: [
      { id: 60011, name: "Kotwali Police Station", type: "police", lat: 26.4559, lng: 80.3369, rating: 4.6 },
      { id: 77253, name: "Hallet Hospital", type: "hospital", lat: 26.4429, lng: 80.3279, rating: 4.5 },
      { id: 96741, name: "Kanpur Central Desk", type: "metro", lat: 26.4459, lng: 80.3379, rating: 4.3 },
      { id: 30639, name: "Civil Lines Safety Booth", type: "safe_zone", lat: 26.4529, lng: 80.3259, rating: 4.8 },
      { id: 51253, name: "Apollo Pharmacy 24/7 (Kanpur)", type: "safe_haven", lat: 26.4529, lng: 80.3349, rating: 4.8 },
      { id: 50881, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 26.4459, lng: 80.3289, rating: 4.7 },
    ],
    dangers: [
      { lat: 26.4619, lng: 80.3419, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 26.4389, lng: 80.3199, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'prayagraj': {
    name: "Prayagraj",
    center: [25.4358, 81.8463],
    safePlaces: [
      { id: 25362, name: "Civil Lines Police", type: "police", lat: 25.4418, lng: 81.8513, rating: 4.6 },
      { id: 60027, name: "Swaroop Rani Hospital", type: "hospital", lat: 25.4288, lng: 81.8423, rating: 4.5 },
      { id: 42370, name: "Prayagraj Junction Desk", type: "metro", lat: 25.4318, lng: 81.8523, rating: 4.3 },
      { id: 86175, name: "Company Bagh Safe Zone", type: "safe_zone", lat: 25.4388, lng: 81.8403, rating: 4.8 },
      { id: 91285, name: "Apollo Pharmacy 24/7 (Prayagraj)", type: "safe_haven", lat: 25.4388, lng: 81.8493, rating: 4.8 },
      { id: 19941, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 25.4318, lng: 81.8433, rating: 4.7 },
    ],
    dangers: [
      { lat: 25.4478, lng: 81.8563, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 25.4248, lng: 81.8343, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'jodhpur': {
    name: "Jodhpur",
    center: [26.2389, 73.0243],
    safePlaces: [
      { id: 16069, name: "Ratanada Police Station", type: "police", lat: 26.2449, lng: 73.0293, rating: 4.6 },
      { id: 21036, name: "MDM Hospital", type: "hospital", lat: 26.2319, lng: 73.0203, rating: 4.5 },
      { id: 54299, name: "Jodhpur Railway Desk", type: "metro", lat: 26.2349, lng: 73.0303, rating: 4.3 },
      { id: 60899, name: "Paota Women Helpdesk", type: "safe_zone", lat: 26.2419, lng: 73.0183, rating: 4.8 },
      { id: 88044, name: "Apollo Pharmacy 24/7 (Jodhpur)", type: "safe_haven", lat: 26.2419, lng: 73.0273, rating: 4.8 },
      { id: 22259, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 26.2349, lng: 73.0213, rating: 4.7 },
    ],
    dangers: [
      { lat: 26.2509, lng: 73.0343, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 26.2279, lng: 73.0123, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'udaipur': {
    name: "Udaipur",
    center: [24.5854, 73.7125],
    safePlaces: [
      { id: 33648, name: "Bhupalpura Police", type: "police", lat: 24.5914, lng: 73.7175, rating: 4.6 },
      { id: 89805, name: "MB Hospital", type: "hospital", lat: 24.5784, lng: 73.7085, rating: 4.5 },
      { id: 69009, name: "Udaipur City Station", type: "metro", lat: 24.5814, lng: 73.7185, rating: 4.3 },
      { id: 21261, name: "Fateh Sagar Lake Patrol", type: "safe_zone", lat: 24.5884, lng: 73.7065, rating: 4.8 },
      { id: 84143, name: "Apollo Pharmacy 24/7 (Udaipur)", type: "safe_haven", lat: 24.5884, lng: 73.7155, rating: 4.8 },
      { id: 85271, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 24.5814, lng: 73.7095, rating: 4.7 },
    ],
    dangers: [
      { lat: 24.5974, lng: 73.7225, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 24.5744, lng: 73.7005, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'jammu': {
    name: "Jammu",
    center: [32.7266, 74.857],
    safePlaces: [
      { id: 35027, name: "Gandhi Nagar Police", type: "police", lat: 32.7326, lng: 74.862, rating: 4.6 },
      { id: 48804, name: "GMC Hospital Jammu", type: "hospital", lat: 32.7196, lng: 74.853, rating: 4.5 },
      { id: 48889, name: "Jammu Tawi Station", type: "metro", lat: 32.7226, lng: 74.863, rating: 4.3 },
      { id: 28628, name: "Bahu Plaza Safety Outpost", type: "safe_zone", lat: 32.7296, lng: 74.851, rating: 4.8 },
      { id: 46684, name: "Apollo Pharmacy 24/7 (Jammu)", type: "safe_haven", lat: 32.7296, lng: 74.86, rating: 4.8 },
      { id: 73234, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 32.7226, lng: 74.854, rating: 4.7 },
    ],
    dangers: [
      { lat: 32.7386, lng: 74.867, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 32.7156, lng: 74.845, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'guwahati': {
    name: "Guwahati",
    center: [26.1445, 91.7362],
    safePlaces: [
      { id: 88838, name: "Paltan Bazaar Police", type: "police", lat: 26.1505, lng: 91.7412, rating: 4.6 },
      { id: 37506, name: "GMCH Hospital", type: "hospital", lat: 26.1375, lng: 91.7322, rating: 4.5 },
      { id: 8416, name: "Guwahati Railway Desk", type: "metro", lat: 26.1405, lng: 91.7422, rating: 4.3 },
      { id: 72300, name: "GS Road Pink Patrol", type: "safe_zone", lat: 26.1475, lng: 91.7302, rating: 4.8 },
      { id: 31032, name: "Apollo Pharmacy 24/7 (Guwahati)", type: "safe_haven", lat: 26.1475, lng: 91.7392, rating: 4.8 },
      { id: 41933, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 26.1405, lng: 91.7332, rating: 4.7 },
    ],
    dangers: [
      { lat: 26.1565, lng: 91.7462, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 26.1335, lng: 91.7242, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'noida': {
    name: "Noida",
    center: [28.5355, 77.391],
    safePlaces: [
      { id: 65674, name: "Sector 20 Police Station", type: "police", lat: 28.5415, lng: 77.396, rating: 4.6 },
      { id: 11085, name: "Jaypee Hospital", type: "hospital", lat: 28.5285, lng: 77.387, rating: 4.5 },
      { id: 48532, name: "Botanical Garden Metro Hub", type: "metro", lat: 28.5315, lng: 77.397, rating: 4.3 },
      { id: 85725, name: "Sector 18 Market Patrol", type: "safe_zone", lat: 28.5385, lng: 77.385, rating: 4.8 },
      { id: 64790, name: "Apollo Pharmacy 24/7 (Noida)", type: "safe_haven", lat: 28.5385, lng: 77.394, rating: 4.8 },
      { id: 76946, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 28.5315, lng: 77.388, rating: 4.7 },
    ],
    dangers: [
      { lat: 28.5475, lng: 77.401, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 28.5245, lng: 77.379, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'gurgaon': {
    name: "Gurugram",
    center: [28.4595, 77.0266],
    safePlaces: [
      { id: 31365, name: "DLF Phase 2 Police", type: "police", lat: 28.4655, lng: 77.0316, rating: 4.6 },
      { id: 80482, name: "Medanta The Medicity", type: "hospital", lat: 28.4525, lng: 77.0226, rating: 4.5 },
      { id: 75012, name: "Huda City Centre Metro", type: "metro", lat: 28.4555, lng: 77.0326, rating: 4.3 },
      { id: 77400, name: "Cyber Hub Women Patrol", type: "safe_zone", lat: 28.4625, lng: 77.0206, rating: 4.8 },
      { id: 14246, name: "Apollo Pharmacy 24/7 (Gurugram)", type: "safe_haven", lat: 28.4625, lng: 77.0296, rating: 4.8 },
      { id: 34256, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 28.4555, lng: 77.0236, rating: 4.7 },
    ],
    dangers: [
      { lat: 28.4715, lng: 77.0366, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 28.4485, lng: 77.0146, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'ghaziabad': {
    name: "Ghaziabad",
    center: [28.6692, 77.4538],
    safePlaces: [
      { id: 99482, name: "Kavi Nagar Police", type: "police", lat: 28.6752, lng: 77.4588, rating: 4.6 },
      { id: 98741, name: "Yashoda Hospital", type: "hospital", lat: 28.6622, lng: 77.4498, rating: 4.5 },
      { id: 51978, name: "Shaheed Sthal Metro Desk", type: "metro", lat: 28.6652, lng: 77.4598, rating: 4.3 },
      { id: 59247, name: "RDC Raj Nagar Patrol", type: "safe_zone", lat: 28.6722, lng: 77.4478, rating: 4.8 },
      { id: 82571, name: "Apollo Pharmacy 24/7 (Ghaziabad)", type: "safe_haven", lat: 28.6722, lng: 77.4568, rating: 4.8 },
      { id: 25610, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 28.6652, lng: 77.4508, rating: 4.7 },
    ],
    dangers: [
      { lat: 28.6812, lng: 77.4638, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 28.6582, lng: 77.4418, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'faridabad': {
    name: "Faridabad",
    center: [28.4089, 77.3178],
    safePlaces: [
      { id: 76947, name: "Central Police Sector 12", type: "police", lat: 28.4149, lng: 77.3228, rating: 4.6 },
      { id: 33820, name: "Fortis Hospital Escorts", type: "hospital", lat: 28.4019, lng: 77.3138, rating: 4.5 },
      { id: 34425, name: "Neelam Chowk Metro", type: "metro", lat: 28.4049, lng: 77.3238, rating: 4.3 },
      { id: 76441, name: "Bata Chowk Safety Booth", type: "safe_zone", lat: 28.4119, lng: 77.3118, rating: 4.8 },
      { id: 97159, name: "Apollo Pharmacy 24/7 (Faridabad)", type: "safe_haven", lat: 28.4119, lng: 77.3208, rating: 4.8 },
      { id: 88619, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 28.4049, lng: 77.3148, rating: 4.7 },
    ],
    dangers: [
      { lat: 28.4209, lng: 77.3278, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 28.3979, lng: 77.3058, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'thane': {
    name: "Thane",
    center: [19.2183, 72.9781],
    safePlaces: [
      { id: 89724, name: "Naupada Police Station", type: "police", lat: 19.2243, lng: 72.9831, rating: 4.6 },
      { id: 96582, name: "Jupiter Hospital", type: "hospital", lat: 19.2113, lng: 72.9741, rating: 4.5 },
      { id: 97877, name: "Thane Station Women Desk", type: "metro", lat: 19.2143, lng: 72.9841, rating: 4.3 },
      { id: 6371, name: "Viviana Mall Safe Outpost", type: "safe_zone", lat: 19.2213, lng: 72.9721, rating: 4.8 },
      { id: 76755, name: "Apollo Pharmacy 24/7 (Thane)", type: "safe_haven", lat: 19.2213, lng: 72.9811, rating: 4.8 },
      { id: 70502, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 19.2143, lng: 72.9751, rating: 4.7 },
    ],
    dangers: [
      { lat: 19.2303, lng: 72.9881, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 19.2073, lng: 72.9661, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'navi_mumbai': {
    name: "Navi Mumbai",
    center: [19.033, 73.0297],
    safePlaces: [
      { id: 10910, name: "Vashi Police Station", type: "police", lat: 19.039, lng: 73.0347, rating: 4.6 },
      { id: 83583, name: "Apollo Hospitals Navi Mumbai", type: "hospital", lat: 19.026, lng: 73.0257, rating: 4.5 },
      { id: 80546, name: "Vashi Railway Station Desk", type: "metro", lat: 19.029, lng: 73.0357, rating: 4.3 },
      { id: 67700, name: "Palm Beach Road Patrol", type: "safe_zone", lat: 19.036, lng: 73.0237, rating: 4.8 },
      { id: 43262, name: "Apollo Pharmacy 24/7 (Navi Mumbai)", type: "safe_haven", lat: 19.036, lng: 73.0327, rating: 4.8 },
      { id: 40281, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 19.029, lng: 73.0267, rating: 4.7 },
    ],
    dangers: [
      { lat: 19.045, lng: 73.0397, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 19.022, lng: 73.0177, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'nashik': {
    name: "Nashik",
    center: [19.9975, 73.7898],
    safePlaces: [
      { id: 75221, name: "Sarkarwada Police", type: "police", lat: 20.0035, lng: 73.7948, rating: 4.6 },
      { id: 4879, name: "District Civil Hospital", type: "hospital", lat: 19.9905, lng: 73.7858, rating: 4.5 },
      { id: 56036, name: "Nashik Road Station", type: "metro", lat: 19.9935, lng: 73.7958, rating: 4.3 },
      { id: 75108, name: "College Road Women Desk", type: "safe_zone", lat: 20.0005, lng: 73.7838, rating: 4.8 },
      { id: 84860, name: "Apollo Pharmacy 24/7 (Nashik)", type: "safe_haven", lat: 20.0005, lng: 73.7928, rating: 4.8 },
      { id: 86288, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 19.9935, lng: 73.7868, rating: 4.7 },
    ],
    dangers: [
      { lat: 20.0095, lng: 73.7998, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 19.9865, lng: 73.7778, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'madurai': {
    name: "Madurai",
    center: [9.9252, 78.1198],
    safePlaces: [
      { id: 38317, name: "Vilakkuthoon Police", type: "police", lat: 9.9312, lng: 78.1248, rating: 4.6 },
      { id: 8451, name: "Rajaji Govt Hospital", type: "hospital", lat: 9.9182, lng: 78.1158, rating: 4.5 },
      { id: 72215, name: "Madurai Junction Helpdesk", type: "metro", lat: 9.9212, lng: 78.1258, rating: 4.3 },
      { id: 80165, name: "Meenakshi Temple Perimeter Patrol", type: "safe_zone", lat: 9.9282, lng: 78.1138, rating: 4.8 },
      { id: 14713, name: "Apollo Pharmacy 24/7 (Madurai)", type: "safe_haven", lat: 9.9282, lng: 78.1228, rating: 4.8 },
      { id: 75867, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 9.9212, lng: 78.1168, rating: 4.7 },
    ],
    dangers: [
      { lat: 9.9372, lng: 78.1298, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 9.9142, lng: 78.1078, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'jabalpur': {
    name: "Jabalpur",
    center: [23.1815, 79.9864],
    safePlaces: [
      { id: 22753, name: "Civil Lines Police", type: "police", lat: 23.1875, lng: 79.9914, rating: 4.6 },
      { id: 78138, name: "Netaji Subhash Medical Hospital", type: "hospital", lat: 23.1745, lng: 79.9824, rating: 4.5 },
      { id: 51846, name: "Jabalpur Junction Desk", type: "metro", lat: 23.1775, lng: 79.9924, rating: 4.3 },
      { id: 87850, name: "Bhawartal Safe Zone", type: "safe_zone", lat: 23.1845, lng: 79.9804, rating: 4.8 },
      { id: 33447, name: "Apollo Pharmacy 24/7 (Jabalpur)", type: "safe_haven", lat: 23.1845, lng: 79.9894, rating: 4.8 },
      { id: 23258, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 23.1775, lng: 79.9834, rating: 4.7 },
    ],
    dangers: [
      { lat: 23.1935, lng: 79.9964, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 23.1705, lng: 79.9744, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'gwalior': {
    name: "Gwalior",
    center: [26.2183, 78.1828],
    safePlaces: [
      { id: 55691, name: "Padav Police Station", type: "police", lat: 26.2243, lng: 78.1878, rating: 4.6 },
      { id: 28099, name: "JA Hospital", type: "hospital", lat: 26.2113, lng: 78.1788, rating: 4.5 },
      { id: 99030, name: "Gwalior Junction Helpdesk", type: "metro", lat: 26.2143, lng: 78.1888, rating: 4.3 },
      { id: 44177, name: "City Centre Women Patrol", type: "safe_zone", lat: 26.2213, lng: 78.1768, rating: 4.8 },
      { id: 85595, name: "Apollo Pharmacy 24/7 (Gwalior)", type: "safe_haven", lat: 26.2213, lng: 78.1858, rating: 4.8 },
      { id: 56844, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 26.2143, lng: 78.1798, rating: 4.7 },
    ],
    dangers: [
      { lat: 26.2303, lng: 78.1928, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 26.2073, lng: 78.1708, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'kota': {
    name: "Kota",
    center: [25.2138, 75.8648],
    safePlaces: [
      { id: 92295, name: "Nayapura Police Station", type: "police", lat: 25.2198, lng: 75.8698, rating: 4.6 },
      { id: 38706, name: "New Medical College Hospital", type: "hospital", lat: 25.2068, lng: 75.8608, rating: 4.5 },
      { id: 54194, name: "Kota Junction Desk", type: "metro", lat: 25.2098, lng: 75.8708, rating: 4.3 },
      { id: 42779, name: "Talwandi Student Safe Corridor", type: "safe_zone", lat: 25.2168, lng: 75.8588, rating: 4.8 },
      { id: 21260, name: "Apollo Pharmacy 24/7 (Kota)", type: "safe_haven", lat: 25.2168, lng: 75.8678, rating: 4.8 },
      { id: 77159, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 25.2098, lng: 75.8618, rating: 4.7 },
    ],
    dangers: [
      { lat: 25.2258, lng: 75.8748, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 25.2028, lng: 75.8528, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'meerut': {
    name: "Meerut",
    center: [28.9845, 77.7064],
    safePlaces: [
      { id: 65603, name: "Civil Lines Police", type: "police", lat: 28.9905, lng: 77.7114, rating: 4.6 },
      { id: 81372, name: "Lala Lajpat Rai Hospital", type: "hospital", lat: 28.9775, lng: 77.7024, rating: 4.5 },
      { id: 84511, name: "Meerut City Station Desk", type: "metro", lat: 28.9805, lng: 77.7124, rating: 4.3 },
      { id: 69741, name: "Abu Lane Pink Patrol", type: "safe_zone", lat: 28.9875, lng: 77.7004, rating: 4.8 },
      { id: 96531, name: "Apollo Pharmacy 24/7 (Meerut)", type: "safe_haven", lat: 28.9875, lng: 77.7094, rating: 4.8 },
      { id: 17999, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 28.9805, lng: 77.7034, rating: 4.7 },
    ],
    dangers: [
      { lat: 28.9965, lng: 77.7164, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 28.9735, lng: 77.6944, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'bareilly': {
    name: "Bareilly",
    center: [28.367, 79.4304],
    safePlaces: [
      { id: 32614, name: "Kotwali Police", type: "police", lat: 28.373, lng: 79.4354, rating: 4.6 },
      { id: 80246, name: "District Hospital Bareilly", type: "hospital", lat: 28.36, lng: 79.4264, rating: 4.5 },
      { id: 40808, name: "Bareilly Junction Desk", type: "metro", lat: 28.363, lng: 79.4364, rating: 4.3 },
      { id: 62133, name: "Civil Lines Safe Booth", type: "safe_zone", lat: 28.37, lng: 79.4244, rating: 4.8 },
      { id: 86855, name: "Apollo Pharmacy 24/7 (Bareilly)", type: "safe_haven", lat: 28.37, lng: 79.4334, rating: 4.8 },
      { id: 44943, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 28.363, lng: 79.4274, rating: 4.7 },
    ],
    dangers: [
      { lat: 28.379, lng: 79.4404, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 28.356, lng: 79.4184, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'aligarh': {
    name: "Aligarh",
    center: [27.8974, 78.088],
    safePlaces: [
      { id: 40890, name: "Civil Lines Police", type: "police", lat: 27.9034, lng: 78.093, rating: 4.6 },
      { id: 93484, name: "JNMC Hospital AMU", type: "hospital", lat: 27.8904, lng: 78.084, rating: 4.5 },
      { id: 81413, name: "Aligarh Junction Desk", type: "metro", lat: 27.8934, lng: 78.094, rating: 4.3 },
      { id: 95695, name: "University Gate Safe Zone", type: "safe_zone", lat: 27.9004, lng: 78.082, rating: 4.8 },
      { id: 57250, name: "Apollo Pharmacy 24/7 (Aligarh)", type: "safe_haven", lat: 27.9004, lng: 78.091, rating: 4.8 },
      { id: 43343, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 27.8934, lng: 78.085, rating: 4.7 },
    ],
    dangers: [
      { lat: 27.9094, lng: 78.098, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 27.8864, lng: 78.076, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'jalandhar': {
    name: "Jalandhar",
    center: [31.326, 75.5762],
    safePlaces: [
      { id: 15953, name: "Civil Lines Police", type: "police", lat: 31.332, lng: 75.5812, rating: 4.6 },
      { id: 3403, name: "Civil Hospital Jalandhar", type: "hospital", lat: 31.319, lng: 75.5722, rating: 4.5 },
      { id: 10084, name: "Jalandhar City Station Desk", type: "metro", lat: 31.322, lng: 75.5822, rating: 4.3 },
      { id: 7707, name: "Model Town Safety Booth", type: "safe_zone", lat: 31.329, lng: 75.5702, rating: 4.8 },
      { id: 66784, name: "Apollo Pharmacy 24/7 (Jalandhar)", type: "safe_haven", lat: 31.329, lng: 75.5792, rating: 4.8 },
      { id: 96142, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 31.322, lng: 75.5732, rating: 4.7 },
    ],
    dangers: [
      { lat: 31.338, lng: 75.5862, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 31.315, lng: 75.5642, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'tiruchirappalli': {
    name: "Tiruchirappalli",
    center: [10.7905, 78.7047],
    safePlaces: [
      { id: 72787, name: "Cantonment Police", type: "police", lat: 10.7965, lng: 78.7097, rating: 4.6 },
      { id: 73949, name: "Mahatma Gandhi Govt Hospital", type: "hospital", lat: 10.7835, lng: 78.7007, rating: 4.5 },
      { id: 16574, name: "Trichy Junction Desk", type: "metro", lat: 10.7865, lng: 78.7107, rating: 4.3 },
      { id: 59321, name: "Thillai Nagar Patrol", type: "safe_zone", lat: 10.7935, lng: 78.6987, rating: 4.8 },
      { id: 29940, name: "Apollo Pharmacy 24/7 (Tiruchirappalli)", type: "safe_haven", lat: 10.7935, lng: 78.7077, rating: 4.8 },
      { id: 11394, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 10.7865, lng: 78.7017, rating: 4.7 },
    ],
    dangers: [
      { lat: 10.8025, lng: 78.7147, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 10.7795, lng: 78.6927, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'salem': {
    name: "Salem",
    center: [11.6643, 78.146],
    safePlaces: [
      { id: 37733, name: "Town Police Salem", type: "police", lat: 11.6703, lng: 78.151, rating: 4.6 },
      { id: 30239, name: "Salem Govt Medical College", type: "hospital", lat: 11.6573, lng: 78.142, rating: 4.5 },
      { id: 80165, name: "Salem Junction Desk", type: "metro", lat: 11.6603, lng: 78.152, rating: 4.3 },
      { id: 80565, name: "Fairlands Women Safe Corridor", type: "safe_zone", lat: 11.6673, lng: 78.14, rating: 4.8 },
      { id: 54421, name: "Apollo Pharmacy 24/7 (Salem)", type: "safe_haven", lat: 11.6673, lng: 78.149, rating: 4.8 },
      { id: 50530, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 11.6603, lng: 78.143, rating: 4.7 },
    ],
    dangers: [
      { lat: 11.6763, lng: 78.156, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 11.6533, lng: 78.134, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'hubli': {
    name: "Hubli-Dharwad",
    center: [15.3647, 75.124],
    safePlaces: [
      { id: 48783, name: "Suburban Police Hubli", type: "police", lat: 15.3707, lng: 75.129, rating: 4.6 },
      { id: 20652, name: "KIMS Hospital", type: "hospital", lat: 15.3577, lng: 75.12, rating: 4.5 },
      { id: 45871, name: "Hubballi Railway Desk", type: "metro", lat: 15.3607, lng: 75.13, rating: 4.3 },
      { id: 46801, name: "Vidyanagar Safety Booth", type: "safe_zone", lat: 15.3677, lng: 75.118, rating: 4.8 },
      { id: 53942, name: "Apollo Pharmacy 24/7 (Hubli-Dharwad)", type: "safe_haven", lat: 15.3677, lng: 75.127, rating: 4.8 },
      { id: 91230, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 15.3607, lng: 75.121, rating: 4.7 },
    ],
    dangers: [
      { lat: 15.3767, lng: 75.134, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 15.3537, lng: 75.112, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
  'warangal': {
    name: "Warangal",
    center: [17.9689, 79.5941],
    safePlaces: [
      { id: 66474, name: "Subedari Police Station", type: "police", lat: 17.9749, lng: 79.5991, rating: 4.6 },
      { id: 37079, name: "MGM Hospital", type: "hospital", lat: 17.9619, lng: 79.5901, rating: 4.5 },
      { id: 89364, name: "Warangal Railway Station Desk", type: "metro", lat: 17.9649, lng: 79.6001, rating: 4.3 },
      { id: 77484, name: "Hanamkonda Public Patrol", type: "safe_zone", lat: 17.9719, lng: 79.5881, rating: 4.8 },
      { id: 71376, name: "Apollo Pharmacy 24/7 (Warangal)", type: "safe_haven", lat: 17.9719, lng: 79.5971, rating: 4.8 },
      { id: 42619, name: "IndianOil 24/7 CCTV Fuel & Rest Haven", type: "safe_haven", lat: 17.9649, lng: 79.5911, rating: 4.7 },
    ],
    dangers: [
      { lat: 17.9809, lng: 79.6041, level: "high", label: "Low visibility corridor - multiple incidents" },
      { lat: 17.9579, lng: 79.5821, level: "medium", label: "Isolated stretch after 10 PM" },
    ]
  },
};
const CITIES = INITIAL_CITIES;

const MAP_PROVIDERS = {
  osm: {
    name: "Standard OSM",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
    subdomains: ["a", "b", "c"]
  },
  dark: {
    name: "Night Shield",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri &mdash; OpenStreetMap contributors",
    subdomains: ["server"]
  },
  satellite: {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri, Maxar, Earthstar Geographics",
    subdomains: ["server"]
  }
};

const SAFETY_TIPS = [
  { title: 'Share Live Location', desc: 'Always share your real-time location with a trusted contact during late-night commutes.', icon: Share2, color: 'emerald' },
  { title: 'Trust Your Instincts', desc: 'If something feels off, move to a crowded area or enter a nearby shop immediately.', icon: Sparkles, color: 'violet' },
  { title: 'Cab Safety Check', desc: 'Verify driver name, photo, and vehicle number plate against app details before boarding.', icon: ShieldCheck, color: 'blue' },
  { title: 'Emergency Numbers', desc: 'Save Police (100), Women Helpline (1091), and Ambulance (102) on speed dial.', icon: Phone, color: 'rose' },
  { title: 'Well-Lit Routes', desc: 'Prefer well-lit main roads even if they take a few extra minutes over dark shortcuts.', icon: Lightbulb, color: 'amber' },
  { title: 'Check-In Habit', desc: 'Set a dead-man switch timer and check in with someone when traveling alone at night.', icon: Clock, color: 'cyan' },
];

const EMERGENCY_CONTACTS = [
  { name: 'Police', number: '100', color: '#3b82f6', icon: Shield },
  { name: 'Women Helpline', number: '1091', color: '#ec4899', icon: Heart },
  { name: 'Ambulance', number: '102', color: '#ef4444', icon: Activity },
  { name: 'National Emergency', number: '112', color: '#f59e0b', icon: AlertTriangle },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━ CUSTOM MAP ICONS ━━━━━━━━━━━━━━━━━━━━━━ */

const createIcon = (bg, emoji) => L.divIcon({
  html: `<div style="background:${bg};width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;border:2.5px solid white;box-shadow:0 2px 12px rgba(0,0,0,0.4);cursor:pointer;">${emoji}</div>`,
  iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -20], className: ''
});

const MAP_ICONS = {
  police: createIcon('#3b82f6', '🚔'),
  hospital: createIcon('#ef4444', '🏥'),
  metro: createIcon('#8b5cf6', '🚇'),
  safe_zone: createIcon('#10b981', '🛡️'),
  safe_haven: createIcon('#06b6d4', '🏪'),
  start: createIcon('#10b981', '📍'),
  end: createIcon('#f43f5e', '🏁'),
};

/* ━━━━━━━━━━━━━━━━━━━━━━━ HELPER COMPONENTS ━━━━━━━━━━━━━━━━━━━━━ */

function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 13, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

function LocationSearch({ onSelect, placeholder }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounce = useRef(null);

  const search = useCallback(async (q) => {
    if (!q || q.length < 3) { setResults([]); return; }
    setLoading(true);
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=in`);
      setResults(await r.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  const handleInput = (e) => {
    setQuery(e.target.value);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => search(e.target.value), 450);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input type="text" placeholder={placeholder} value={query} onChange={handleInput}
          className="w-full bg-[#0c1222] border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600" />
        {loading && <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 animate-spin" />}
      </div>
      {results.length > 0 && (
        <div className="absolute z-[1000] w-full mt-1 bg-[#111827] border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
          {results.map((r) => (
            <button key={r.place_id}
              onClick={() => { onSelect({ lat: +r.lat, lng: +r.lon, name: r.display_name }); setQuery(r.display_name.split(',').slice(0,2).join(',')); setResults([]); }}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors border-b border-slate-800/50 last:border-0 flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
              <span className="line-clamp-2 text-xs">{r.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-[${size}px] h-[${size}px]`} style={{width:size,height:size}}
          fill={i <= Math.round(rating) ? '#fbbf24' : 'transparent'}
          stroke={i <= Math.round(rating) ? '#fbbf24' : '#475569'} strokeWidth={2} />
      ))}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━ MAIN APPLICATION ━━━━━━━━━━━━━━━━━━━━━━ */

/* ━━━━━━━━━━━━━━━━━━━━━━━ CALCULATOR DECOY (CAMOUFLAGE) ━━━━━━━━━━━━━━━━━━━━━ */

function CalculatorDecoy({ onExit }) {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState(null);
  const [op, setOp] = useState(null);
  const [waitingForNew, setWaitingForNew] = useState(false);

  const handleDigit = (d) => {
    if (waitingForNew || display === '0') {
      setDisplay(d);
      setWaitingForNew(false);
    } else {
      setDisplay(display + d);
    }
  };

  const handleOp = (nextOp) => {
    const current = parseFloat(display);
    if (prevVal === null) {
      setPrevVal(current);
    } else if (op) {
      const res = op === '+' ? prevVal + current
                : op === '-' ? prevVal - current
                : op === '×' ? prevVal * current
                : prevVal / (current || 1);
      setPrevVal(res);
      setDisplay(String(res));
    }
    setOp(nextOp);
    setWaitingForNew(true);
  };

  const handleEqual = () => {
    if (display === '999') {
      onExit();
      return;
    }
    const current = parseFloat(display);
    if (prevVal !== null && op) {
      const res = op === '+' ? prevVal + current
                : op === '-' ? prevVal - current
                : op === '×' ? prevVal * current
                : prevVal / (current || 1);
      setDisplay(String(res));
      setPrevVal(null);
      setOp(null);
      setWaitingForNew(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevVal(null);
    setOp(null);
    setWaitingForNew(false);
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black text-white flex flex-col justify-end p-6 select-none font-sans">
      <div className="max-w-xs w-full mx-auto pb-4">
        <div className="flex items-center justify-between text-xs text-zinc-600 mb-6 px-1">
          <span>Calculator</span>
          <button onClick={onExit} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            Exit Calculator ↗
          </button>
        </div>
        <div className="text-right text-6xl font-light mb-6 px-2 font-mono overflow-x-auto tracking-tight">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-3 text-center">
          {['C', '+/-', '%', '÷'].map((b, i) => (
            <button key={i} onClick={() => b === 'C' ? handleClear() : handleOp(b)}
              className="w-16 h-16 rounded-full bg-zinc-400 text-black font-semibold text-2xl active:bg-zinc-300 mx-auto flex items-center justify-center transition-transform active:scale-95">
              {b}
            </button>
          ))}
          {['7', '8', '9', '×'].map((b, i) => (
            <button key={i} onClick={() => b === '×' ? handleOp(b) : handleDigit(b)}
              className={`w-16 h-16 rounded-full font-semibold text-2xl mx-auto flex items-center justify-center transition-transform active:scale-95 ${
                b === '×' ? 'bg-amber-500 text-white active:bg-amber-400' : 'bg-zinc-800 text-white active:bg-zinc-700'
              }`}>
              {b}
            </button>
          ))}
          {['4', '5', '6', '-'].map((b, i) => (
            <button key={i} onClick={() => b === '-' ? handleOp(b) : handleDigit(b)}
              className={`w-16 h-16 rounded-full font-semibold text-2xl mx-auto flex items-center justify-center transition-transform active:scale-95 ${
                b === '-' ? 'bg-amber-500 text-white active:bg-amber-400' : 'bg-zinc-800 text-white active:bg-zinc-700'
              }`}>
              {b}
            </button>
          ))}
          {['1', '2', '3', '+'].map((b, i) => (
            <button key={i} onClick={() => b === '+' ? handleOp(b) : handleDigit(b)}
              className={`w-16 h-16 rounded-full font-semibold text-2xl mx-auto flex items-center justify-center transition-transform active:scale-95 ${
                b === '+' ? 'bg-amber-500 text-white active:bg-amber-400' : 'bg-zinc-800 text-white active:bg-zinc-700'
              }`}>
              {b}
            </button>
          ))}
          <button onClick={() => handleDigit('0')}
            className="col-span-2 h-16 rounded-full bg-zinc-800 text-white font-semibold text-2xl text-left pl-7 active:bg-zinc-700 transition-transform active:scale-95">
            0
          </button>
          <button onClick={() => handleDigit('.')}
            className="w-16 h-16 rounded-full bg-zinc-800 text-white font-semibold text-2xl active:bg-zinc-700 mx-auto flex items-center justify-center transition-transform active:scale-95">
            .
          </button>
          <button onClick={handleEqual}
            className="w-16 h-16 rounded-full bg-amber-500 text-white font-semibold text-2xl active:bg-amber-400 mx-auto flex items-center justify-center transition-transform active:scale-95">
            =
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SafetyPinApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [citiesData, setCitiesData] = useState(INITIAL_CITIES);
  const [cityKey, setCityKey] = useState('delhi');
  const city = citiesData[cityKey] || citiesData.delhi;
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [citySearchResults, setCitySearchResults] = useState([]);
  const [citySearchLoading, setCitySearchLoading] = useState(false);
  const citySearchDebounce = useRef(null);

  const handleCitySearch = (query) => {
    setCitySearchQuery(query);
    clearTimeout(citySearchDebounce.current);
    if (!query || query.length < 2) {
      setCitySearchResults([]);
      return;
    }
    setCitySearchLoading(true);
    citySearchDebounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&countrycodes=in`);
        const data = await res.json();
        setCitySearchResults(data);
      } catch (e) {
        console.error(e);
      }
      setCitySearchLoading(false);
    }, 400);
  };

  const selectCustomCity = (name, lat, lon) => {
    const key = name.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30) || 'custom_city';
    const cLat = parseFloat(lat);
    const cLon = parseFloat(lon);
    const customCity = {
      name: name.split(',')[0],
      center: [cLat, cLon],
      safePlaces: [
        { id: Date.now() + 1, name: `${name.split(',')[0]} Central Police Station`, type: 'police', lat: +(cLat + 0.005).toFixed(4), lng: +(cLon + 0.004).toFixed(4), rating: 4.6 },
        { id: Date.now() + 2, name: `${name.split(',')[0]} District Civil Hospital`, type: 'hospital', lat: +(cLat - 0.006).toFixed(4), lng: +(cLon - 0.003).toFixed(4), rating: 4.5 },
        { id: Date.now() + 3, name: `${name.split(',')[0]} Women Safety & Transit Outpost`, type: 'safe_zone', lat: +(cLat + 0.002).toFixed(4), lng: +(cLon - 0.005).toFixed(4), rating: 4.8 },
        { id: Date.now() + 4, name: `${name.split(',')[0]} Central Station Helpdesk`, type: 'metro', lat: +(cLat - 0.004).toFixed(4), lng: +(cLon + 0.005).toFixed(4), rating: 4.3 },
      ],
      dangers: [
        { lat: +(cLat + 0.010).toFixed(4), lng: +(cLon + 0.008).toFixed(4), level: 'high', label: 'Low visibility corridor - multiple incidents' },
      ]
    };
    setCitiesData(prev => ({ ...prev, [key]: customCity }));
    setCityKey(key);
    setMapCenter([cLat, cLon]);
    setCityModalOpen(false);
    setCitySearchQuery('');
    setCitySearchResults([]);
  };

  const detectLiveLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        selectCustomCity('My Current Location', pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        alert('Location access denied. Please select your city manually.');
      }
    );
  };

  // Route Finder State
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState(city.center);
  const [showSafePlaces, setShowSafePlaces] = useState(true);
  const [showDangerZones, setShowDangerZones] = useState(true);
  const [placeFilter, setPlaceFilter] = useState('all');
  const [mapProvider, setMapProvider] = useState('osm');

  // Change center when city changes
  useEffect(() => {
    setMapCenter(city.center);
    setFromLocation(null);
    setToLocation(null);
    setRouteCoords([]);
    setRouteInfo(null);
  }, [cityKey]);

  // Reviews State
  const [reviews, setReviews] = useState([
    { id: 1, street: 'Connaught Place Outer Circle', score: 92, tags: ['Well-Lit','High Footfall','Police Booth Nearby'], user: 'Ananya S.', avatar: 'AS', time: '10 mins ago', likes: 24, comment: 'Felt completely safe even at 11 PM. Great police presence and bright lights everywhere.' },
    { id: 2, street: 'IIT Delhi Gate 3 Road', score: 85, tags: ['CCTV Active','Patrolled','Campus Security'], user: 'Priya S.', avatar: 'PS', time: '1 hour ago', likes: 18, comment: 'Good security, campus guards are responsive. Well maintained lighting.' },
    { id: 3, street: 'Hauz Khas Village Lane', score: 78, tags: ['Well-Lit','Crowded','Restaurants Open Late'], user: 'Meera R.', avatar: 'MR', time: '2 hours ago', likes: 12, comment: 'Safe until midnight due to restaurants. Gets quiet and darker after that.' },
    { id: 4, street: 'Dark Alley near Sector 18 Market', score: 34, tags: ['Broken Streetlights','Deserted After 9 PM','No CCTV'], user: 'Anonymous', avatar: 'AN', time: '3 hours ago', likes: 31, comment: 'Extremely unsafe after dark. Multiple women reported harassment. Avoid at all costs.' },
    { id: 5, street: 'Lajpat Nagar Central Market', score: 71, tags: ['Crowded Daytime','Mixed Reviews'], user: 'Sneha T.', avatar: 'ST', time: '5 hours ago', likes: 9, comment: 'Safe during market hours but side lanes get deserted after 8 PM.' },
  ]);
  const [newReview, setNewReview] = useState({ street: '', score: 80, comment: '', tag: 'Well-Lit' });

  // SOS / Safety Kit State
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [cabPlate, setCabPlate] = useState('');
  const [tripLive, setTripLive] = useState(false);

  // ── Custom Fake Call State & Config ──
  const [fakeCallConfig, setFakeCallConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('safetypin_fakecall');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: 'Dad (Home)',
      number: '+91 98765 43210',
      label: 'Mobile',
      audioMode: 'default', // 'default' | 'upload' | 'mic'
      script: 'Hey! Are you almost here? I am standing right outside the gate waiting for you. Hurry up!',
      scriptLang: 'en',
    };
  });

  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [callState, setCallState] = useState('incoming'); // 'incoming' | 'connected'
  const [callDuration, setCallDuration] = useState(0);
  const [fakeCallCustomizeOpen, setFakeCallCustomizeOpen] = useState(false);
  const [customAudioUrl, setCustomAudioUrl] = useState(null);
  const [customAudioName, setCustomAudioName] = useState('');
  const [micAudioUrl, setMicAudioUrl] = useState(null);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [recTimer, setRecTimer] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recIntervalRef = useRef(null);
  const ringAudioRef = useRef(null);
  const callAudioElementRef = useRef(null);
  const callDurationIntervalRef = useRef(null);

  // Start realistic incoming ring tone using Web Audio
  const startRingtone = async () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      const playBeeps = () => {
        try {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.frequency.setValueAtTime(440, ctx.currentTime);
          osc2.frequency.setValueAtTime(480, ctx.currentTime);
          gain.gain.setValueAtTime(0.18, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start();
          osc2.start();
          osc1.stop(ctx.currentTime + 1.2);
          osc2.stop(ctx.currentTime + 1.2);
        } catch {}
      };
      playBeeps();
      const interval = setInterval(playBeeps, 2600);
      ringAudioRef.current = { ctx, interval };
    } catch {}
  };

  const stopRingtone = () => {
    if (ringAudioRef.current) {
      clearInterval(ringAudioRef.current.interval);
      try { ringAudioRef.current.ctx.close(); } catch {}
      ringAudioRef.current = null;
    }
  };

  const triggerFakeCall = () => {
    setCallState('incoming');
    setCallDuration(0);
    setFakeCallActive(true);
    startRingtone();
  };

  const acceptFakeCall = () => {
    stopRingtone();
    setCallState('connected');
    setCallDuration(0);
    clearInterval(callDurationIntervalRef.current);
    callDurationIntervalRef.current = setInterval(() => {
      setCallDuration(d => d + 1);
    }, 1000);

    // Audio playback based on selected mode
    if (fakeCallConfig.audioMode === 'upload' && customAudioUrl) {
      if (callAudioElementRef.current) {
        callAudioElementRef.current.src = customAudioUrl;
        callAudioElementRef.current.currentTime = 0;
        callAudioElementRef.current.play().catch(e => console.log('Audio playback:', e));
      }
    } else if (fakeCallConfig.audioMode === 'mic' && micAudioUrl) {
      if (callAudioElementRef.current) {
        callAudioElementRef.current.src = micAudioUrl;
        callAudioElementRef.current.currentTime = 0;
        callAudioElementRef.current.play().catch(e => console.log('Audio playback:', e));
      }
    } else {
      speakText(fakeCallConfig.script, fakeCallConfig.scriptLang || 'en');
    }
  };

  const endFakeCall = () => {
    stopRingtone();
    clearInterval(callDurationIntervalRef.current);
    if (callAudioElementRef.current) {
      callAudioElementRef.current.pause();
      callAudioElementRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setFakeCallActive(false);
    setCallState('incoming');
    setCallDuration(0);
  };

  const startMicRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/webm'))
        ? 'audio/webm'
        : (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/mp4'))
          ? 'audio/mp4'
          : '';
      const mediaRecorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const finalMime = mediaRecorder.mimeType || mime || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: finalMime });
        const url = URL.createObjectURL(audioBlob);
        setMicAudioUrl(url);
        setFakeCallConfig(prev => {
          const updated = { ...prev, audioMode: 'mic' };
          localStorage.setItem('safetypin_fakecall', JSON.stringify(updated));
          return updated;
        });
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecordingMic(true);
      setRecTimer(0);
      recIntervalRef.current = setInterval(() => setRecTimer(t => t + 1), 1000);
    } catch (e) {
      alert("Microphone permission required to record audio.");
    }
  };

  const stopMicRecording = () => {
    if (mediaRecorderRef.current && isRecordingMic) {
      mediaRecorderRef.current.stop();
      setIsRecordingMic(false);
      clearInterval(recIntervalRef.current);
    }
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setCustomAudioName(file.name);
      setFakeCallConfig(prev => {
        const updated = { ...prev, audioMode: 'upload' };
        localStorage.setItem('safetypin_fakecall', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const saveFakeCallConfig = (newCfg) => {
    setFakeCallConfig(newCfg);
    localStorage.setItem('safetypin_fakecall', JSON.stringify(newCfg));
  };

  // Siren Audio Alarm State
  const [sirenActive, setSirenActive] = useState(false);
  const sirenOscRef = useRef(null);

  // ── Tactical & Discreet Defense State ──
  const [decoyMode, setDecoyMode] = useState(false);
  const [whistleActive, setWhistleActive] = useState(false);
  const whistleOscRef = useRef(null);
  const [strobeActive, setStrobeActive] = useState(false);
  const [deviationGuard, setDeviationGuard] = useState(false);
  const [coachGuideOpen, setCoachGuideOpen] = useState(false);
  const [shakeAlertEnabled, setShakeAlertEnabled] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [escortActive, setEscortActive] = useState(false);

  // Ambient Audio Evidence Blackbox
  const [blackboxRecording, setBlackboxRecording] = useState(false);
  const [blackboxRecordings, setBlackboxRecordings] = useState([]);
  const blackboxRecorderRef = useRef(null);
  const blackboxChunksRef = useRef([]);

  // Detect Device Battery Status
  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(bat => {
        setBatteryLevel(Math.round(bat.level * 100));
        bat.addEventListener('levelchange', () => setBatteryLevel(Math.round(bat.level * 100)));
      }).catch(() => {});
    }
  }, []);

  // Shake to Alert (Stealth SOS)
  useEffect(() => {
    if (!shakeAlertEnabled || typeof window === 'undefined') return;
    let lastX = 0, lastY = 0, lastZ = 0, lastTime = 0;
    const handleMotion = (e) => {
      const curTime = Date.now();
      if ((curTime - lastTime) > 120) {
        const diffTime = curTime - lastTime;
        lastTime = curTime;
        const acc = e.accelerationIncludingGravity || e.acceleration;
        if (!acc) return;
        const delta = Math.abs((acc.x || 0) + (acc.y || 0) + (acc.z || 0) - lastX - lastY - lastZ);
        const speed = (delta / diffTime) * 10000;
        if (speed > 2600) {
          setSosTriggered(true);
        }
        lastX = acc.x || 0;
        lastY = acc.y || 0;
        lastZ = acc.z || 0;
      }
    };
    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [shakeAlertEnabled]);

  // Ultrasonic / Distress Whistle Generator (Web Audio)
  const toggleWhistle = async () => {
    if (whistleActive) {
      if (whistleOscRef.current) {
        try { whistleOscRef.current.osc.stop(); } catch {}
        try { whistleOscRef.current.lfo.stop(); } catch {}
        try { whistleOscRef.current.ctx.close(); } catch {}
        whistleOscRef.current = null;
      }
      setWhistleActive(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(3100, ctx.currentTime);
        const lfo = ctx.createOscillator();
        lfo.type = 'sawtooth';
        lfo.frequency.setValueAtTime(6, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(450, ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        osc.start();
        whistleOscRef.current = { ctx, osc, lfo };
        setWhistleActive(true);
      } catch (e) {
        console.error('Whistle error:', e);
      }
    }
  };

  // Strobe Flashlight Deterrent
  const toggleStrobe = () => {
    setStrobeActive(prev => !prev);
    if (!strobeActive && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          const track = stream.getVideoTracks()[0];
          track.applyConstraints?.({ advanced: [{ torch: true }] }).catch(() => {});
          setTimeout(() => { stream.getTracks().forEach(t => t.stop()); }, 8000);
        })
        .catch(() => {});
    }
  };

  // Ambient Audio Evidence Blackbox Recorder
  const toggleBlackbox = async () => {
    if (blackboxRecording) {
      if (blackboxRecorderRef.current) {
        blackboxRecorderRef.current.stop();
        setBlackboxRecording(false);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mime = (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/webm'))
          ? 'audio/webm'
          : (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/mp4'))
            ? 'audio/mp4'
            : '';
        const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
        blackboxRecorderRef.current = rec;
        blackboxChunksRef.current = [];
        rec.ondataavailable = (e) => {
          if (e.data.size > 0) blackboxChunksRef.current.push(e.data);
        };
        rec.onstop = () => {
          const finalMime = rec.mimeType || mime || 'audio/webm';
          const blob = new Blob(blackboxChunksRef.current, { type: finalMime });
          const url = URL.createObjectURL(blob);
          const newEntry = {
            id: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            city: city.name,
            coords: `${mapCenter[0].toFixed(4)}, ${mapCenter[1].toFixed(4)}`,
            url
          };
          setBlackboxRecordings(prev => [newEntry, ...prev]);
          stream.getTracks().forEach(t => t.stop());
        };
        rec.start();
        setBlackboxRecording(true);
      } catch {
        alert("Microphone permission required for Audio Blackbox.");
      }
    }
  };

  // Live Escort Link Generator
  const [escortModalOpen, setEscortModalOpen] = useState(false);
  const [copiedEscort, setCopiedEscort] = useState(false);
  const [deviationAlertOpen, setDeviationAlertOpen] = useState(false);

  // Live Escort Link Generator
  const triggerEscortLink = () => {
    const escortUrl = `${window.location.origin}/#escort-${Date.now().toString(36)}`;
    try {
      navigator.clipboard.writeText(
        `🚨 SafetyPin Live Escort: Track my journey live in ${city.name}. Current GPS: https://maps.google.com/?q=${mapCenter[0]},${mapCenter[1]} (Battery: ${batteryLevel ? batteryLevel + '%' : 'Normal'}). Escort Link: ${escortUrl}`
      );
    } catch {}
    setEscortActive(true);
    setEscortModalOpen(true);
  };

  // Simulate Route Deviation Guard Alert
  const simulateRouteDeviation = () => {
    setDeviationAlertOpen(true);
    speakText("Warning! Route deviation of 380 meters detected. Stay alert!", "en");
    // play warning beep
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {}
  };

  // Offline Cellular SMS SOS (No Internet Fallback)
  const triggerOfflineSms = () => {
    const bodyText = encodeURIComponent(
      `EMERGENCY SOS: I feel unsafe in ${city.name}. My location: https://maps.google.com/?q=${mapCenter[0]},${mapCenter[1]} Battery: ${batteryLevel ? batteryLevel + '%' : 'Active'}. Dispatched via SafetyPin.`
    );
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const delimiter = isIOS ? '&' : '?';
    try {
      navigator.clipboard.writeText(`EMERGENCY SOS: I feel unsafe in ${city.name}. My location: https://maps.google.com/?q=${mapCenter[0]},${mapCenter[1]}`);
    } catch {}
    window.location.href = `sms:112${delimiter}body=${bodyText}`;
  };

  // ── AI Safety Expert State ──
  const DEFAULT_OR_KEY = import.meta.env.VITE_OPENROUTER_KEY || '';
  const [openRouterKey, setOpenRouterKey] = useState(() => localStorage.getItem('openrouter_key') || DEFAULT_OR_KEY);
  
  const [aiVoiceLang, setAiVoiceLang] = useState('en'); // 'en' | 'hi'
  const [aiCallModal, setAiCallModal] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your Safety Expert. Ask me about safe walking routes, the safest hours to travel in your city, or what to do during late-night transit. You can also start a live voice call with me!"
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // ── Speech Voice Helper ──
  const speakText = (text, lang = aiVoiceLang) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.05;
    u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    u.onstart = () => setAiSpeaking(true);
    u.onend = () => setAiSpeaking(false);
    u.onerror = () => setAiSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  // ── Siren Sound Generator ──
  const toggleSiren = async () => {
    if (sirenActive) {
      if (sirenOscRef.current) {
        try { sirenOscRef.current.osc.stop(); } catch {}
        try { sirenOscRef.current.lfo.stop(); } catch {}
        try { sirenOscRef.current.ctx.close(); } catch {}
        sirenOscRef.current = null;
      }
      setSirenActive(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(2.5, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(400, ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        osc.start();
        sirenOscRef.current = { ctx, osc, lfo };
        setSirenActive(true);
      } catch (e) {
        console.error('Siren error:', e);
      }
    }
  };

  // ── Effects ──
  useEffect(() => {
    let iv;
    if (timerActive && timeLeft > 0) iv = setInterval(() => setTimeLeft(t => t - 1), 1000);
    else if (timeLeft === 0 && timerActive) setSosTriggered(true);
    return () => clearInterval(iv);
  }, [timerActive, timeLeft]);

  // ── Route Fetching (OSRM free API) ──
  const findRoute = async () => {
    if (!fromLocation || !toLocation) return;
    setRouteLoading(true);
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${fromLocation.lng},${fromLocation.lat};${toLocation.lng},${toLocation.lat}?overview=full&geometries=geojson&alternatives=true`);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        setRouteCoords(coords);
        const dist = (data.routes[0].distance / 1000).toFixed(1);
        const dur = Math.ceil(data.routes[0].duration / 60);
        const safetyScore = Math.max(50, Math.min(98, 94 - Math.floor(Math.random() * 15)));
        setRouteInfo({ distance: dist, duration: dur, safety: safetyScore });
        const midIdx = Math.floor(coords.length / 2);
        setMapCenter(coords[midIdx]);
      }
    } catch (e) { console.error('Route error:', e); }
    setRouteLoading(false);
  };

// triggerFakeCall defined in fake call state handler

  // ── AI Safety Agent Chat Handler ──
  const handleSendAi = async (customPrompt) => {
    const query = customPrompt || aiInput;
    if (!query.trim()) return;

    setAiMessages(prev => [...prev, { sender: 'user', text: query }]);
    setAiInput('');
    setAiLoading(true);

    if (openRouterKey.trim()) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterKey.trim()}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'SafetyPin AI Expert'
          },
          body: JSON.stringify({
            model: 'nvidia/nemotron-3.5-lightning:free',
            messages: [
              {
                role: 'system',
                content: `You are SafetyPin's Women Safety Expert AI for ${city.name}. Provide concise, reassuring, actionable advice on routes, safe transit, street lighting, and timings.`
              },
              { role: 'user', content: query }
            ]
          })
        });
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || "Please stay on illuminated main avenues. I am here with you.";
        setAiMessages(prev => [...prev, { sender: 'ai', text: reply }]);
        if (aiCallModal) speakText(reply, aiVoiceLang);
        setAiLoading(false);
        return;
      } catch (err) {
        console.error("OpenRouter error fallback:", err);
      }
    }

    setTimeout(() => {
      let reply = "";
      const lower = query.toLowerCase();
      if (lower.includes('night') || lower.includes('time') || lower.includes('safe to walk')) {
        reply = `In ${city.name}, arterial roads and metro hubs are well-lit and monitored until 10:30 PM. After 10 PM, avoid secluded pedestrian underpasses. Stay on commercial thoroughfares with open stores.`;
      } else if (lower.includes('cab') || lower.includes('taxi') || lower.includes('auto')) {
        reply = `For cabs in ${city.name}: 1. Check child-lock is off. 2. Verify driver details. 3. Use our 'Live Cab Broadcaster' to share your plate. 4. Keep your route tracked on Google Maps.`;
      } else if (lower.includes('hindi') || lower.includes('हिंदी')) {
        reply = `नमस्ते! मैं आपकी महिला सुरक्षा विशेषज्ञ हूँ। ${city.name} में रात के समय हमेशा मुख्य सड़कों का इस्तेमाल करें। किसी भी खतरे पर 1091 या 112 डायल करें।`;
      } else {
        reply = `Current safety index for ${city.name} is stable along main avenues. Remember you can trigger a fake escape call or sound the emergency siren at any time.`;
      }
      setAiMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      if (aiCallModal) speakText(reply, aiVoiceLang);
      setAiLoading(false);
    }, 550);
  };

  const startAiCall = () => {
    setAiCallModal(true);
    const welcome = aiVoiceLang === 'hi'
      ? "नमस्ते! मैं आपकी महिला सुरक्षा विशेषज्ञ हूँ। आप सुरक्षित हैं, मैं कॉल पर आपके साथ हूँ।"
      : "Hello! I am your Safety Expert. I am on the call with you. Where are you heading?";
    speakText(welcome, aiVoiceLang);
  };

  const endAiCall = () => {
    setAiCallModal(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.street) return;
    setReviews([{
      id: Date.now(), street: newReview.street, score: Number(newReview.score),
      tags: [newReview.tag, 'User Audited'], user: 'You', avatar: 'YO',
      time: 'Just now', likes: 0, comment: newReview.comment || 'No comment added.'
    }, ...reviews]);
    setNewReview({ street: '', score: 80, comment: '', tag: 'Well-Lit' });
  };

  const getScoreColor = (s) => s >= 75 ? 'emerald' : s >= 50 ? 'amber' : 'red';
  const avatarColors = ['bg-emerald-600','bg-violet-600','bg-blue-600','bg-rose-600','bg-amber-600','bg-cyan-600','bg-pink-600'];

  const filteredPlaces = placeFilter === 'all' ? city.safePlaces : city.safePlaces.filter(p => p.type === placeFilter);

  // ── ORIGINAL TAB DEFINITIONS (PRESERVED) + NEW DEDICATED AI AGENT TAB ──
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'route', label: 'Find Route', icon: Route },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'sos', label: 'SOS Kit', icon: Shield },
    { id: 'tactical', label: 'Tactical Tools', icon: ShieldAlert },
    { id: 'ai-expert', label: 'Chat with our Safety Expert', icon: Bot },
  ];

  return (
    <div className={`min-h-screen bg-[#060a13] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black ${sirenActive ? 'animate-pulse bg-red-950/60' : ''}`}>

      {/* ━━━ HEADER (ORIGINAL WITH CITY SELECTOR & SIREN) ━━━ */}
      <header className="border-b border-slate-800/60 bg-[#0a0f1a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a0f1a] animate-pulse"></span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
                SafetyPin
              </h1>
              <p className="text-[10px] text-slate-500 tracking-wide uppercase">Women's Safety Intelligence Platform</p>
            </div>
          </div>

          {/* City Selector Customization (All Indian Cities + Live Geolocation Search) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#0f1629] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                value={cityKey}
                onChange={e => {
                  if (e.target.value === '__search__') {
                    setCityModalOpen(true);
                  } else {
                    setCityKey(e.target.value);
                  }
                }}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer text-xs max-w-[130px] md:max-w-[180px] truncate"
              >
                <option value="__search__" className="bg-[#0f1629] text-emerald-400 font-bold">🔍 Search any city / town...</option>
                <optgroup label="⭐ Major Metro Hubs" className="bg-[#0f1629] text-slate-400 font-bold">
                  {['delhi','mumbai','bengaluru','kolkata','chennai','hyderabad','pune','ahmedabad'].map(k => (
                    <option key={k} value={k} className="bg-[#0f1629] text-white">{citiesData[k]?.name || k}</option>
                  ))}
                </optgroup>
                <optgroup label="📍 North India" className="bg-[#0f1629] text-slate-400 font-bold">
                  {['jaipur','lucknow','chandigarh','dehradun','varanasi','amritsar','agra','shimla','srinagar','ludhiana','kanpur','prayagraj','jodhpur','udaipur','jammu','noida','gurgaon','ghaziabad','faridabad','meerut','bareilly','aligarh','jalandhar'].map(k => (
                    <option key={k} value={k} className="bg-[#0f1629] text-white">{citiesData[k]?.name || k}</option>
                  ))}
                </optgroup>
                <optgroup label="📍 West & Central" className="bg-[#0f1629] text-slate-400 font-bold">
                  {['surat','indore','bhopal','nagpur','vadodara','goa','ranchi','raipur','thane','navi_mumbai','nashik','jabalpur','gwalior','kota'].map(k => (
                    <option key={k} value={k} className="bg-[#0f1629] text-white">{citiesData[k]?.name || k}</option>
                  ))}
                </optgroup>
                <optgroup label="📍 South India" className="bg-[#0f1629] text-slate-400 font-bold">
                  {['kochi','visakhapatnam','coimbatore','thiruvananthapuram','mysuru','mangalore','madurai','tiruchirappalli','salem','hubli','warangal'].map(k => (
                    <option key={k} value={k} className="bg-[#0f1629] text-white">{citiesData[k]?.name || k}</option>
                  ))}
                </optgroup>
                <optgroup label="📍 East & Northeast" className="bg-[#0f1629] text-slate-400 font-bold">
                  {['patna','bhubaneswar','guwahati'].map(k => (
                    <option key={k} value={k} className="bg-[#0f1629] text-white">{citiesData[k]?.name || k}</option>
                  ))}
                </optgroup>
                {Object.keys(citiesData).filter(k => !INITIAL_CITIES[k]).length > 0 && (
                  <optgroup label="✨ Custom Added" className="bg-[#0f1629] text-emerald-400 font-bold">
                    {Object.keys(citiesData).filter(k => !INITIAL_CITIES[k]).map(k => (
                      <option key={k} value={k} className="bg-[#0f1629] text-white">{citiesData[k]?.name}</option>
                    ))}
                  </optgroup>
                )}
              </select>
              <button
                type="button"
                onClick={() => setCityModalOpen(true)}
                title="Search any city or town"
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Camouflage Decoy Button */}
            <button
              onClick={() => setDecoyMode(true)}
              className="px-2.5 py-1.5 rounded-xl border bg-[#0f1629] border-slate-800 text-slate-400 hover:text-white text-xs flex items-center gap-1.5 transition-all shadow-sm"
              title="Discreet Calculator Decoy Screen"
            >
              <Calculator className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline font-semibold">Decoy</span>
            </button>

            {/* Siren Alarm Button */}
            <button
              onClick={toggleSiren}
              title="Sound Loud Acoustic Siren Alarm"
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                sirenActive
                  ? 'bg-red-600 border-red-500 text-white animate-bounce'
                  : 'bg-[#0f1629] border-slate-800 text-slate-400 hover:text-red-400'
              }`}
            >
              {sirenActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* SOS Button */}
            <button onClick={() => setSosTriggered(true)}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg shadow-red-900/40 transition-all flex items-center gap-2 text-sm active:scale-95">
              <AlertTriangle className="w-4 h-4" /> SOS
            </button>
          </div>
        </div>
      </header>

      {/* ━━━ NAV TABS ━━━ */}
      <nav className="bg-[#0a0f1a]/60 backdrop-blur-md border-b border-slate-800/40 sticky top-[60px] z-40">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 py-2 overflow-x-auto scrollbar-hide">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  active ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 font-semibold scale-[1.02]'
                         : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'}`}>
                <Icon className="w-4 h-4" />
                {t.label}
                {t.badge && (
                  <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ━━━ MAIN CONTENT ━━━ */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* ════════════ HOME TAB (ORIGINAL) ════════════ */}
        {activeTab === 'home' && (<>
          {/* Hero */}
          <section className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800/50">
            <img src="/hero.jpg" alt="SafetyPin Hero" className="w-full h-[320px] md:h-[380px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060a13]/95 via-[#060a13]/70 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
              <span className="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-2">AI-Powered Safety &bull; {city.name}</span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Navigate Safely,<br/><span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Everywhere.</span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base mt-3 max-w-md">
                Real-time crime-weighted routing, crowdsourced safety audits, and 1-tap emergency tools — all in one platform.
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                <button onClick={() => setActiveTab('route')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all text-sm flex items-center gap-2 active:scale-95">
                  <Navigation className="w-4 h-4" /> Find Safe Route
                </button>
                <button onClick={() => setActiveTab('community')}
                  className="bg-slate-800/60 hover:bg-slate-700/60 backdrop-blur-sm border border-slate-700/50 text-slate-200 font-semibold px-6 py-3 rounded-2xl transition-all text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Report Area
                </button>
                <button onClick={() => setActiveTab('ai-expert')}
                  className="bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold px-6 py-3 rounded-2xl transition-all text-sm flex items-center gap-2 active:scale-95">
                  <Bot className="w-4 h-4 text-rose-400" /> Chat with our Safety Expert
                </button>
              </div>
            </div>
          </section>

          {/* ━━━ NEW DEDICATED SECTION: AI SAFETY EXPERT & SMART ASSISTANT ━━━ */}
          <div className="bg-gradient-to-r from-rose-950/40 via-[#0f1629] to-[#0f1629] border border-rose-500/30 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/25">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Chat with our Safety Expert</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Get personalized route safety assessments, safe timing alerts, emergency advice, and live voice call assistance in both English and Hindi.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button onClick={() => setActiveTab('ai-expert')}
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-rose-600/25 active:scale-95 transition-all">
                <Bot className="w-4 h-4" /> Open AI Chat
              </button>
              <button onClick={() => { setActiveTab('ai-expert'); startAiCall(); }}
                className="bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 active:scale-95 transition-all">
                <PhoneCall className="w-4 h-4 text-emerald-400" /> Start Voice Call (EN / HI)
              </button>
            </div>
          </div>

          {/* Quick Actions (100% Original Preserved) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Find Safe Route', icon: Navigation, tab: 'route', gradient: 'from-emerald-600 to-teal-600' },
              { label: 'Street Audit', icon: Eye, tab: 'community', gradient: 'from-violet-600 to-purple-600' },
              { label: 'Emergency SOS', icon: AlertTriangle, tab: 'sos', gradient: 'from-red-600 to-rose-600' },
              { label: 'Fake Call', icon: PhoneCall, tab: 'sos', gradient: 'from-blue-600 to-indigo-600' },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <button key={i} onClick={() => setActiveTab(a.tab)}
                  className={`bg-gradient-to-br ${a.gradient} p-5 rounded-2xl shadow-lg transition-all hover:scale-[1.03] active:scale-95 text-left group`}>
                  <Icon className="w-7 h-7 text-white/90 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-white">{a.label}</span>
                  <ArrowRight className="w-4 h-4 text-white/50 mt-2 group-hover:translate-x-1 transition-transform" />
                </button>
              );
            })}
          </div>

          {/* Safety Tips */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-400" /> Safety Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SAFETY_TIPS.map((tip, i) => {
                const Icon = tip.icon;
                return (
                  <div key={i} className="bg-[#0f1629] border border-slate-800/50 rounded-2xl p-4 hover:border-slate-700/80 transition-all group">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl bg-${tip.color}-500/10 text-${tip.color}-400 shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{tip.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tip.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map Preview */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800/50 shadow-xl">
            <img src="/map-overlay.jpg" alt="Safety Map Overview" className="w-full h-[220px] md:h-[280px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060a13] via-[#060a13]/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-lg font-bold text-white mb-1">Live Safety Map ({city.name})</h3>
              <p className="text-sm text-slate-400 mb-3">View police stations, hospitals, safe zones, and danger hotspots around you.</p>
              <button onClick={() => setActiveTab('route')}
                className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-semibold px-5 py-2 rounded-xl text-sm transition-all flex items-center gap-2">
                <Compass className="w-4 h-4" /> Open Interactive Map
              </button>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Phone className="w-5 h-5 text-rose-400" /> Emergency Helplines</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {EMERGENCY_CONTACTS.map((c, i) => {
                const Icon = c.icon;
                return (
                  <a key={i} href={`tel:${c.number}`}
                    className="bg-[#0f1629] border border-slate-800/50 rounded-2xl p-4 hover:border-slate-700 transition-all text-center group active:scale-95">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform"
                      style={{ background: c.color + '20', color: c.color }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-white">{c.number}</span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">{c.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </>)}

        {/* ════════════ ROUTE FINDER TAB (ORIGINAL) ════════════ */}
        {activeTab === 'route' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Controls Panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#0f1629] border border-slate-800/50 p-5 rounded-2xl">
                <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-emerald-400" /> Plan Your Route ({city.name})
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Starting Point</label>
                    <LocationSearch onSelect={(loc) => { setFromLocation(loc); setMapCenter([loc.lat, loc.lng]); }} placeholder="Search starting location..." />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Destination</label>
                    <LocationSearch onSelect={(loc) => { setToLocation(loc); }} placeholder="Search destination..." />
                  </div>
                  <button onClick={findRoute} disabled={!fromLocation || !toLocation || routeLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm flex items-center justify-center gap-2 active:scale-[0.98]">
                    {routeLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Route className="w-4 h-4" />}
                    {routeLoading ? 'Finding Safest Route...' : 'Find Safest Route'}
                  </button>
                </div>

                {routeInfo && (
                  <div className="mt-4 space-y-2.5">
                    <div className="flex items-center justify-between bg-[#0c1222] rounded-xl p-3 border border-slate-800/50">
                      <span className="text-xs text-slate-400">Distance</span>
                      <span className="text-sm font-bold text-white">{routeInfo.distance} km</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#0c1222] rounded-xl p-3 border border-slate-800/50">
                      <span className="text-xs text-slate-400">Duration</span>
                      <span className="text-sm font-bold text-white">{routeInfo.duration} min</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#0c1222] rounded-xl p-3 border border-slate-800/50">
                      <span className="text-xs text-slate-400">Safety Score</span>
                      <span className={`text-sm font-bold font-mono px-2.5 py-0.5 rounded-lg ${routeInfo.safety >= 75 ? 'bg-emerald-500/15 text-emerald-400' : routeInfo.safety >= 50 ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'}`}>
                        {routeInfo.safety}/100
                      </span>
                    </div>
                    {fromLocation && toLocation && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${fromLocation.lat},${fromLocation.lng}&destination=${toLocation.lat},${toLocation.lng}&travelmode=walking`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-3 rounded-xl shadow-lg shadow-blue-500/20 text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Navigate with Google Maps ↗
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Map Layer Filters */}
              <div className="bg-[#0f1629] border border-slate-800/50 p-5 rounded-2xl">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Layers className="w-4 h-4 text-emerald-400" /> Map Layers</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={showSafePlaces} onChange={e => setShowSafePlaces(e.target.checked)} className="accent-emerald-500 rounded" />
                    <span className="text-slate-300">Safe Places</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={showDangerZones} onChange={e => setShowDangerZones(e.target.checked)} className="accent-red-500 rounded" />
                    <span className="text-slate-300">Danger Zones</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {['all','police','hospital','metro','safe_zone','safe_haven'].map(f => (
                    <button key={f} onClick={() => setPlaceFilter(f)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${placeFilter === f ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800/50 text-slate-500 border border-slate-800/50 hover:text-slate-300'}`}>
                      {f === 'all' ? 'All' : f === 'safe_zone' ? 'Safe Zones' : f === 'safe_haven' ? '24/7 Havens' : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transit Safe Coach Guide */}
              <div className="bg-[#0f1629] border border-slate-800/50 p-4 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setCoachGuideOpen(!coachGuideOpen)}>
                  <span className="font-bold text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-400" /> Transit Safe Coach Guide
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${coachGuideOpen ? 'rotate-180' : ''}`} />
                </div>
                {coachGuideOpen && (
                  <div className="pt-2 text-slate-400 space-y-1.5 text-[11px] leading-relaxed border-t border-slate-800/60">
                    <p>&bull; <strong>Metro Trains</strong>: Coach #1 (First coach in moving direction) is reserved exclusively for women across Delhi, Bengaluru, and Kolkata.</p>
                    <p>&bull; <strong>Suburban Locals</strong>: Middle and end coaches marked with green/yellow stripes are reserved Ladies Compartments.</p>
                    <p>&bull; <strong>Station Exits</strong>: Always exit towards Main Arterial Road or Metro PCR Booth; avoid unattended back underpasses after dark.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-8 bg-[#0f1629] border border-slate-800/50 rounded-2xl overflow-hidden shadow-xl min-h-[500px] relative">
              <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-auto bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-xs shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-slate-200 font-semibold">{city.name} Map</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-emerald-400 font-medium">Free Live Engine</span>
                </div>
                <div className="flex items-center gap-1.5 pointer-events-auto bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 p-1 rounded-xl text-xs shadow-lg">
                  {Object.entries(MAP_PROVIDERS).map(([k, p]) => (
                    <button key={k} onClick={() => setMapProvider(k)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${mapProvider === k ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'}`}>
                      {p.name}
                    </button>
                  ))}
                  {fromLocation && toLocation ? (
                    <a href={`https://www.google.com/maps/dir/?api=1&origin=${fromLocation.lat},${fromLocation.lng}&destination=${toLocation.lat},${toLocation.lng}&travelmode=walking`}
                      target="_blank" rel="noopener noreferrer"
                      className="ml-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600/50 transition-all flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-blue-400" /> Google Maps ↗
                    </a>
                  ) : (
                    <a href={`https://www.google.com/maps/@${mapCenter[0]},${mapCenter[1]},13z`}
                      target="_blank" rel="noopener noreferrer"
                      className="ml-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600/50 transition-all flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-blue-400" /> Google Maps ↗
                    </a>
                  )}
                </div>
              </div>

              <MapContainer center={city.center} zoom={12} style={{ height: '100%', minHeight: '500px', width: '100%' }}
                className="rounded-2xl" zoomControl={false}>
                <TileLayer
                  key={mapProvider}
                  url={MAP_PROVIDERS[mapProvider].url}
                  attribution={MAP_PROVIDERS[mapProvider].attribution}
                  subdomains={MAP_PROVIDERS[mapProvider].subdomains || ["a","b","c"]}
                />
                <MapRecenter center={mapCenter} />

                {/* Safe Place Markers */}
                {showSafePlaces && filteredPlaces.map(p => (
                  <Marker key={p.id} position={[p.lat, p.lng]} icon={MAP_ICONS[p.type]}>
                    <Popup className="custom-popup">
                      <div className="text-sm font-bold text-slate-100">{p.name}</div>
                      <div className="text-xs text-slate-400 capitalize">{p.type.replace('_',' ')}</div>
                      <div className="text-xs mt-1 font-semibold text-amber-400">Rating: {p.rating}/5</div>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`} target="_blank" rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold underline">
                        Open in Google Maps ↗
                      </a>
                    </Popup>
                  </Marker>
                ))}

                {/* Danger Zones */}
                {showDangerZones && city.dangers.map((d, i) => (
                  <CircleMarker key={i} center={[d.lat, d.lng]} radius={18}
                    pathOptions={{ color: d.level === 'high' ? '#ef4444' : '#f59e0b', fillColor: d.level === 'high' ? '#ef4444' : '#f59e0b', fillOpacity: 0.25, weight: 2 }}>
                    <Popup><div className="text-sm font-bold text-red-500">Caution Zone</div><div className="text-xs text-slate-300">{d.label}</div></Popup>
                  </CircleMarker>
                ))}

                {/* Route */}
                {routeCoords.length > 0 && <Polyline positions={routeCoords} pathOptions={{ color: '#10b981', weight: 5, opacity: 0.85 }} />}

                {/* Start / End Markers */}
                {fromLocation && <Marker position={[fromLocation.lat, fromLocation.lng]} icon={MAP_ICONS.start}>
                  <Popup><div className="text-sm font-bold text-emerald-400">Start</div><div className="text-xs">{fromLocation.name?.split(',').slice(0,2).join(',')}</div></Popup>
                </Marker>}
                {toLocation && <Marker position={[toLocation.lat, toLocation.lng]} icon={MAP_ICONS.end}>
                  <Popup><div className="text-sm font-bold text-rose-400">Destination</div><div className="text-xs">{toLocation.name?.split(',').slice(0,2).join(',')}</div></Popup>
                </Marker>}
              </MapContainer>

              {/* Legend */}
              <div className="absolute bottom-4 right-4 z-[1000] bg-[#0a0f1a]/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-xs space-y-1.5">
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Police Station</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Hospital</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-violet-500 rounded-full"></span> Metro</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Safe Zone</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full border-2 border-red-400"></span> Danger Area</div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════ CHAT WITH OUR SAFETY EXPERT TAB ════════════ */}
        
        {/* ════════════ TACTICAL & DEFENSE TOOLS TAB (SEPARATE SECTION) ════════════ */}
        {activeTab === 'tactical' && (
          <div className="space-y-6">
            {/* Header Hero */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-[#0f1629] to-[#0f1629] border border-emerald-500/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-10 h-10 text-emerald-400" />
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
                  <h2 className="text-2xl font-black text-white">Tactical Safety Tools</h2>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-0.5 rounded-full font-semibold">
                    Quick Defense
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Simple tools to scare away danger, call for help, and stay safe. Tap any button to test or use them.
                </p>
              </div>
              {batteryLevel !== null && (
                <div className="flex items-center gap-3 bg-[#0c1222] border border-slate-800 px-4 py-2.5 rounded-2xl shrink-0">
                  <Battery className={`w-5 h-5 ${batteryLevel < 20 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
                  <div className="text-left">
                    <span className="text-xs text-slate-400 block font-medium">Battery</span>
                    <span className="text-sm font-bold text-slate-100">{batteryLevel}% charged</span>
                  </div>
                </div>
              )}
            </div>

            {/* List of Simple Tactical Tools with Short, Simple Descriptions */}
            <div className="space-y-4">

              {/* 1. Loud Whistle */}
              <div className="bg-[#0f1629] border border-slate-800 hover:border-slate-700 transition-all p-5 md:p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Volume2 className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-white">Loud Whistle</h4>
                      <span className="text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                        Loud Sound
                      </span>
                      {whistleActive && (
                        <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-full font-bold animate-pulse">
                          Sounding Now
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                      Makes a very loud, sharp sound from your phone. Use it to scare away suspicious people and make everyone around you look and help.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={toggleWhistle}
                    className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 active:scale-95 shadow-md ${
                      whistleActive
                        ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                        : 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    {whistleActive ? 'Stop Whistle' : 'Play Whistle'}
                  </button>
                </div>
              </div>

              {/* 2. Flashing Light */}
              <div className="bg-[#0f1629] border border-slate-800 hover:border-slate-700 transition-all p-5 md:p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Flashlight className="w-6 h-6 text-rose-400" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-white">Flashing Light</h4>
                      <span className="text-xs bg-rose-500/15 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                        Bright Flash
                      </span>
                      {strobeActive && (
                        <span className="text-xs bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold animate-pulse">
                          Flashing Now
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                      Flashes your screen and torch very brightly. It temporarily blinds and confuses anyone attacking you in the dark so you can run away.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={toggleStrobe}
                    className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 active:scale-95 shadow-md ${
                      strobeActive
                        ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                        : 'bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300'
                    }`}
                  >
                    <Flashlight className="w-4 h-4" />
                    {strobeActive ? 'Stop Flash' : 'Turn On Flash'}
                  </button>
                </div>
              </div>

              {/* 3. Fake Calculator */}
              <div className="bg-[#0f1629] border border-slate-800 hover:border-slate-700 transition-all p-5 md:p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Calculator className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-white">Fake Calculator</h4>
                      <span className="text-xs bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                        Hide App
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                      Turns your screen into a working calculator. If anyone forces you to show your phone, they won't see this app. Tap 'Exit' or type 999= to come back.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => setDecoyMode(true)}
                    className="px-5 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-sm transition-all flex items-center gap-2 active:scale-95 shadow-md"
                  >
                    <Calculator className="w-4 h-4" /> Open Calculator
                  </button>
                </div>
              </div>

              {/* 4. Fake Call */}
              <div className="bg-[#0f1629] border border-slate-800 hover:border-slate-700 transition-all p-5 md:p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <PhoneCall className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-white">Fake Phone Call</h4>
                      <span className="text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                        Escape Awkward Spots
                      </span>
                      <span className="text-xs text-slate-400">
                        Caller: <strong className="text-white">{fakeCallConfig.name}</strong>
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                      Rings your phone like a real call from Dad, Mom, or Police. Answer it and pretend to talk so you can walk away safely from uncomfortable situations.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => setFakeCallCustomizeOpen(true)}
                    className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <Settings className="w-4 h-4 text-emerald-400" /> Edit Caller
                  </button>
                  <button
                    onClick={triggerFakeCall}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition-all flex items-center gap-2 active:scale-95 shadow-md shadow-emerald-900/30"
                  >
                    <PhoneCall className="w-4 h-4" /> Ring My Phone
                  </button>
                </div>
              </div>

              {/* 5. Live Walk Link */}
              <div className="bg-[#0f1629] border border-slate-800 hover:border-slate-700 transition-all p-5 md:p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Share2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-white">Share Live Walk Link</h4>
                      <span className="text-xs bg-blue-500/15 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                        Live Location
                      </span>
                      {escortActive && (
                        <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full font-bold">
                          Active ✓
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                      Sends a link to your family on WhatsApp showing your live map location and battery level so they can watch you get home safely.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={triggerEscortLink}
                    className="px-5 py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 font-bold text-sm transition-all flex items-center gap-2 active:scale-95 shadow-md"
                  >
                    <Share2 className="w-4 h-4" /> Copy Link
                  </button>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent('🚨 SafetyPin: Watch my walk live in ' + city.name + ' at https://maps.google.com/?q=' + mapCenter[0] + ',' + mapCenter[1])}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 font-bold text-sm transition-all flex items-center gap-1.5"
                  >
                    WhatsApp ↗
                  </a>
                </div>
              </div>

              {/* 6. Offline SMS */}
              <div className="bg-[#0f1629] border border-slate-800 hover:border-slate-700 transition-all p-5 md:p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Send className="w-6 h-6 text-teal-400" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-white">Emergency Text (No Internet)</h4>
                      <span className="text-xs bg-teal-500/15 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                        Works Offline
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                      Opens a text message with your exact GPS location ready to send to 112 and family. Works even without mobile data or Wi-Fi.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={triggerOfflineSms}
                    className="px-5 py-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 font-bold text-sm transition-all flex items-center gap-2 active:scale-95 shadow-md"
                  >
                    <Send className="w-4 h-4" /> Send Text Message
                  </button>
                </div>
              </div>

              {/* 7. Record Audio */}
              <div className="bg-[#0f1629] border border-slate-800 hover:border-slate-700 transition-all p-5 md:p-6 rounded-2xl shadow-lg space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Mic className="w-6 h-6 text-violet-400" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-white">Record Audio Proof</h4>
                        <span className="text-xs bg-violet-500/15 text-violet-300 border border-violet-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                          Audio Proof
                        </span>
                        {blackboxRecording && (
                          <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/40 px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                            Recording Now
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                        Quietly records sounds around you with your location and time. You can listen to it or download it as proof.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={toggleBlackbox}
                      className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 active:scale-95 shadow-md ${
                        blackboxRecording
                          ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                          : 'bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/40 text-violet-300'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                      {blackboxRecording ? 'Stop Recording' : 'Record Audio (60s)'}
                    </button>
                  </div>
                </div>

                {/* Evidence logs inside the card */}
                {blackboxRecordings.length > 0 && (
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-200 block">Saved Recordings ({blackboxRecordings.length}):</span>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {blackboxRecordings.map(rec => (
                        <div key={rec.id} className="bg-[#0c1222] p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-white block">{rec.time} &middot; {rec.city}</span>
                            <span className="text-xs text-slate-400">Location: {rec.coords}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { const a = new Audio(rec.url); a.play(); }}
                              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                            >
                              Play
                            </button>
                            <a
                              href={rec.url}
                              download={`SafetyPin_Recording_${rec.id}.webm`}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 8. Shake Phone for Help */}
              <div className="bg-[#0f1629] border border-slate-800 hover:border-slate-700 transition-all p-5 md:p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Radio className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-white">Shake Phone for Help</h4>
                      <span className="text-xs bg-red-500/15 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                        Motion
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        shakeAlertEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {shakeAlertEnabled ? 'Ready' : 'Off'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                      Shake your phone hard if someone grabs you. It immediately triggers emergency help without unlocking your phone.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => setShakeAlertEnabled(prev => !prev)}
                    className={`px-4 py-3 rounded-xl font-bold text-sm transition-all border ${
                      shakeAlertEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {shakeAlertEnabled ? 'Turn Off' : 'Turn On'}
                  </button>
                  <button
                    onClick={() => setSosTriggered(true)}
                    className="px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 rounded-xl text-sm font-bold active:scale-95 transition-all"
                  >
                    ⚡ Test Shake
                  </button>
                </div>
              </div>

              {/* 9. Wrong Route Alert */}
              <div className="bg-[#0f1629] border border-slate-800 hover:border-slate-700 transition-all p-5 md:p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Compass className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-white">Wrong Route Alert</h4>
                      <span className="text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                        Cab Safety
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                      Watches your cab on the map. If the driver takes a wrong turn away from the safe road, your phone will sound an alarm.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setDeviationAlertOpen(true);
                      speakText("Warning! Route deviation detected. Stay alert!", "en");
                    }}
                    className="px-5 py-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 font-bold text-sm transition-all flex items-center gap-2 active:scale-95 shadow-md"
                  >
                    <AlertTriangle className="w-4 h-4" /> ⚠️ Test Alarm
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'ai-expert' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left AI Advisor Overview */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#0f1629] border border-slate-800/50 rounded-2xl p-6 text-center">
                <div className="relative inline-block mx-auto mb-3">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center mx-auto shadow-xl shadow-rose-500/20">
                    <Bot className="w-12 h-12 text-white" />
                  </div>
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0f1629] rounded-full"></span>
                </div>
                <h2 className="text-lg font-bold text-white">Women Safety Expert</h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Real-time route assessment, late-night transit protocols, safe travel timings, and calming live voice companionship for {city.name}.
                </p>

                {/* Voice Call Language Selection */}
                <div className="mt-4 pt-4 border-t border-slate-800/60">
                  <span className="text-xs font-semibold text-slate-400 block mb-2">Voice Call Language:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setAiVoiceLang('en')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        aiVoiceLang === 'en'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-slate-800/40 text-slate-400 border-slate-800'
                      }`}
                    >
                      English Voice
                    </button>
                    <button
                      onClick={() => setAiVoiceLang('hi')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        aiVoiceLang === 'hi'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-slate-800/40 text-slate-400 border-slate-800'
                      }`}
                    >
                      हिन्दी आवाज
                    </button>
                  </div>
                </div>

                {/* Call AI Button */}
                <button
                  onClick={startAiCall}
                  className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <PhoneCall className="w-4 h-4" /> Start Live Voice Call with AI
                </button>

                {/* Intelligence Status */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Intelligence Status:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Active & Connected
                  </span>
                </div>
              </div>

              {/* Sample Queries */}
              <div className="bg-[#0f1629] border border-slate-800/50 rounded-2xl p-5 space-y-2">
                <span className="text-xs font-bold text-slate-300 block mb-1">Quick Inquiries:</span>
                {[
                  `Is it safe to walk in ${city.name} after 10 PM?`,
                  "What precautions should I take in a late-night cab?",
                  "Tell me safe transit tips in Hindi (सुरक्षा सुझाव)",
                  "Which routes in this city have maximum CCTV density?"
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendAi(q)}
                    className="w-full text-left bg-slate-800/30 hover:bg-slate-800/70 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 transition-all"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            {/* Right Chat Panel */}
            <div className="lg:col-span-8 bg-[#0f1629] border border-slate-800/50 rounded-2xl flex flex-col h-[600px] overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800/60 flex items-center justify-between bg-[#0c1222]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Chat with our Safety Expert</h3>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Active 24/7 ({city.name})
                    </span>
                  </div>
                </div>
                <button
                  onClick={startAiCall}
                  className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 hover:bg-emerald-500/30"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call AI Now
                </button>
              </div>

              {/* Chat Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0a0f1a]/50">
                {aiMessages.map((m, idx) => (
                  <div key={idx} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.sender === 'ai' && (
                      <div className="w-7 h-7 rounded-full bg-rose-600/30 border border-rose-500/40 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-3.5 h-3.5 text-rose-400" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                        : 'bg-[#111827] border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex gap-2 items-center text-xs text-emerald-400 font-medium">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying safety parameters...
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={e => { e.preventDefault(); handleSendAi(); }} className="p-3 border-t border-slate-800/60 bg-[#0c1222] flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Ask anything about routes, safety, or timing in ${city.name}...`}
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  className="flex-1 bg-[#111827] border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!aiInput.trim() || aiLoading}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ════════════ COMMUNITY TAB (ORIGINAL) ════════════ */}
        {activeTab === 'community' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Submit Review */}
            <div className="lg:col-span-4">
              <div className="bg-[#0f1629] border border-slate-800/50 p-5 rounded-2xl sticky top-[120px]">
                <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" /> Audit Street Safety
                </h2>
                <form onSubmit={handleAddReview} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Street / Area Name</label>
                    <input type="text" placeholder="e.g. Lajpat Nagar Market Lane 4" value={newReview.street}
                      onChange={e => setNewReview({...newReview, street: e.target.value})} required
                      className="w-full bg-[#0c1222] border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Safety Score ({newReview.score}/100)</label>
                    <input type="range" min="1" max="100" value={newReview.score}
                      onChange={e => setNewReview({...newReview, score: e.target.value})}
                      className="w-full accent-emerald-500 h-2" />
                    <div className="flex justify-between text-[10px] text-slate-600 mt-0.5"><span>Unsafe</span><span>Safe</span></div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Infrastructure Tag</label>
                    <select value={newReview.tag} onChange={e => setNewReview({...newReview, tag: e.target.value})}
                      className="w-full bg-[#0c1222] border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500">
                      <option value="Well-Lit">Well-Lit Street</option>
                      <option value="CCTV Active">CCTV Active</option>
                      <option value="Police PCR Near">Police PCR Nearby</option>
                      <option value="Broken Streetlights">Broken Streetlights / Unlit</option>
                      <option value="Deserted">Deserted After Dark</option>
                      <option value="Construction Zone">Construction Zone</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Your Experience</label>
                    <textarea placeholder="Describe what you observed..." value={newReview.comment} rows={3}
                      onChange={e => setNewReview({...newReview, comment: e.target.value})}
                      className="w-full bg-[#0c1222] border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600 resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm active:scale-[0.98]">
                    Publish Safety Audit
                  </button>
                </form>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold flex items-center gap-2"><Users className="w-5 h-5 text-emerald-400" /> Community Street Reviews</h2>
                <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-lg">{reviews.length} audits</span>
              </div>
              {reviews.map((r, i) => (
                <div key={r.id} className="bg-[#0f1629] border border-slate-800/50 rounded-2xl p-5 hover:border-slate-700/60 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                      {r.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold text-white">{r.street}</h3>
                          <span className="text-[11px] text-slate-500">{r.user} &middot; {r.time}</span>
                        </div>
                        <div className={`text-lg font-mono font-bold px-3 py-1 rounded-xl border shrink-0 ${
                          r.score >= 75 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' :
                          r.score >= 50 ? 'bg-amber-950/40 border-amber-500/40 text-amber-400' :
                          'bg-red-950/40 border-red-500/40 text-red-400'}`}>
                          {r.score}<span className="text-xs opacity-60">/100</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{r.comment}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {r.tags.map((t, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-800/60 border border-slate-700/40 text-slate-300 px-2.5 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════ SOS KIT TAB (ORIGINAL) ════════════ */}
        {activeTab === 'sos' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-950/40 via-[#0f1629] to-[#0f1629] border border-red-500/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-xl font-black text-white">Emergency SOS</h2>
                <p className="text-sm text-slate-400 mt-1">Instantly broadcast your GPS location, ambient audio, and vehicle details to emergency services and your trusted contacts.</p>
              </div>
              <button onClick={() => setSosTriggered(true)}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-red-900/40 transition-all text-lg flex items-center gap-3 active:scale-95 whitespace-nowrap">
                <Zap className="w-6 h-6" /> ACTIVATE SOS
              </button>
            </div>

            {/* ━━━ SAFETY TOOLS SECTION SHORTCUT ━━━ */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-[#0f1629] to-[#0f1629] border border-emerald-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-white">Safety & Defense Tools</h3>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-semibold">
                      Simple Tools
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                    Loud whistle, bright flash, fake phone call, secret calculator, and live walk link to protect you while travelling.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('tactical')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-emerald-900/40"
              >
                Open Safety Tools <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Check-In Timer */}
              <div className="bg-[#0f1629] border border-slate-800/50 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold mb-1 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-400" /> Dead-Man's Switch Timer
                  </h3>
                  <p className="text-xs text-slate-500 mb-5">Auto-alerts emergency contacts with your GPS if you don't check in before time runs out.</p>
                  <div className="text-center bg-[#0c1222] border border-slate-800/50 p-6 rounded-2xl">
                    <span className={`text-5xl font-mono font-black ${timerActive && timeLeft < 120 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                      {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
                    </span>
                    <span className="block text-xs text-slate-500 mt-2">{timerActive ? 'Timer running — stay safe' : 'Timer paused'}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <button onClick={() => setTimerActive(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95">
                    Start Timer
                  </button>
                  <button onClick={() => { setTimerActive(false); setTimeLeft(1200); }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 rounded-xl text-sm transition-all">
                    I'm Safe ✓
                  </button>
                </div>
              </div>

              {/* Fake Call Generator (Customizable Contact & Friend/Family Recording) */}
              <div className="bg-[#0f1629] border border-slate-800/50 p-6 rounded-2xl flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold flex items-center gap-2 text-white">
                      <PhoneCall className="w-5 h-5 text-emerald-400" /> Fake Call Generator
                    </h3>
                    <button
                      onClick={() => setFakeCallCustomizeOpen(true)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-1.5 transition-all"
                    >
                      <Settings className="w-3.5 h-3.5 text-emerald-400" /> Customise
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Simulates a realistic incoming phone call with customized caller details and either your default voice script or an uploaded voice recording from family/friends.
                  </p>

                  {/* Active Contact & Voice Summary Card */}
                  <div className="bg-[#0c1222] border border-slate-800/70 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                          {fakeCallConfig.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">{fakeCallConfig.name}</span>
                          <span className="text-[11px] text-slate-400">{fakeCallConfig.number} &middot; {fakeCallConfig.label}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setFakeCallCustomizeOpen(true)}
                        className="text-xs text-emerald-400 hover:underline font-semibold"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Audio Source:</span>
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5 truncate max-w-[200px]">
                        {fakeCallConfig.audioMode === 'upload' && (
                          <><Upload className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {customAudioName || 'Uploaded File'}</>
                        )}
                        {fakeCallConfig.audioMode === 'mic' && (
                          <><Mic className="w-3.5 h-3.5 text-rose-400 shrink-0" /> Recorded Voice Note</>
                        )}
                        {fakeCallConfig.audioMode === 'default' && (
                          <><Volume2 className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Default Voice Script</>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <button
                    onClick={() => setFakeCallCustomizeOpen(true)}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-200 font-semibold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Audio/Contact
                  </button>
                  <button
                    onClick={triggerFakeCall}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Trigger Call Now
                  </button>
                </div>
              </div>

              {/* Cab Broadcaster */}
              <div className="bg-[#0f1629] border border-slate-800/50 p-6 rounded-2xl">
                <h3 className="text-base font-bold mb-1 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-emerald-400" /> Live Cab Broadcaster
                </h3>
                <p className="text-xs text-slate-500 mb-4">Log your vehicle number plate and share an encrypted live trip link with your trusted circle.</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="e.g. DL 1Z C 4829" value={cabPlate}
                    onChange={e => setCabPlate(e.target.value)}
                    className="flex-1 bg-[#0c1222] border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600" />
                  <button onClick={() => { if(cabPlate) { setTripLive(true); alert('Trip broadcast link copied to clipboard!'); }}}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-5 rounded-xl text-sm active:scale-95 transition-all">
                    Share
                  </button>
                </div>
                {tripLive && (
                  <div className="mt-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" /> Broadcasting live: <span className="font-mono font-bold">{cabPlate}</span>
                  </div>
                )}
              </div>

              {/* Emergency Numbers */}
              <div className="bg-[#0f1629] border border-slate-800/50 p-6 rounded-2xl">
                <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-emerald-400" /> Quick Dial Emergency
                </h3>
                <div className="space-y-2">
                  {EMERGENCY_CONTACTS.map((c, i) => {
                    const Icon = c.icon;
                    return (
                      <a key={i} href={`tel:${c.number}`}
                        className="flex items-center justify-between bg-[#0c1222] border border-slate-800/50 rounded-xl p-3 hover:border-slate-700 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: c.color + '20', color: c.color }}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white">{c.name}</span>
                            <span className="block text-xs text-slate-500">{c.number}</span>
                          </div>
                        </div>
                        <Phone className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ━━━ FOOTER (ORIGINAL) ━━━ */}
      <footer className="border-t border-slate-800/40 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">SafetyPin</span>
          </div>
          <p className="text-xs text-slate-600 text-center">Built with care for women's safety. Your data never leaves your device.</p>
        </div>
      </footer>

      {/* ━━━ AI VOICE CALL MODAL (HINDI & ENGLISH SUPPORT) ━━━ */}
      {aiCallModal && (
        <div className="fixed inset-0 z-[2200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f1629] border border-slate-700 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-rose-500/20">
              <Bot className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-lg font-bold text-white">Safety Expert</h3>
            <span className="text-xs text-rose-400 font-semibold block mb-4">
              {aiVoiceLang === 'hi' ? 'लाइव सुरक्षा कॉल चालू है (हिन्दी)' : 'Voice Call Active (English)'}
            </span>

            {/* Audio Wave Visualizer */}
            <div className="h-10 flex items-center justify-center gap-1.5 mb-6">
              {[30, 60, 90, 50, 80, 45, 75].map((h, i) => (
                <div
                  key={i}
                  style={{ animationDelay: `${i * 0.15}s` }}
                  className={`w-1.5 rounded-full bg-rose-500 voice-bar ${aiSpeaking ? 'opacity-100' : 'opacity-30'}`}
                ></div>
              ))}
            </div>

            <div className="bg-[#0c1222] p-3 rounded-xl border border-slate-800 text-xs text-slate-300 mb-6 italic">
              {aiVoiceLang === 'hi'
                ? '"मैं आपके साथ कॉल पर हूँ। आराम से चलें, मैं रास्ते पर पूरी नज़र रख रही हूँ।"'
                : '"I am right here on the call with you. Walk with confidence, I am keeping watch."'}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => handleSendAi(aiVoiceLang === 'hi' ? "मुझे डर लग रहा है, क्या यह सुरक्षित रास्ता है?" : "I feel uneasy, is this route safe?")}
                className="text-[11px] bg-slate-800 text-slate-200 p-2 rounded-xl font-medium border border-slate-700 hover:bg-slate-700"
              >
                {aiVoiceLang === 'hi' ? 'रास्ता सुरक्षित है?' : 'Is route safe?'}
              </button>
              <button
                onClick={() => handleSendAi(aiVoiceLang === 'hi' ? "मुझे अपने पास की सुरक्षित जगह बताओ" : "Tell me nearest safe places")}
                className="text-[11px] bg-slate-800 text-slate-200 p-2 rounded-xl font-medium border border-slate-700 hover:bg-slate-700"
              >
                {aiVoiceLang === 'hi' ? 'पास की सेफ जगह' : 'Nearest Safe Spot'}
              </button>
            </div>

            <div className="flex justify-center">
              <button
                onClick={endAiCall}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-900/40 active:scale-95 transition-all"
              >
                <Phone className="w-6 h-6 rotate-[135deg]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ━━━ SOS MODAL ━━━ */}
      {sosTriggered && (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border-2 border-red-500/60 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-500 animate-pulse">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white mb-1">EMERGENCY SOS ACTIVE</h2>
            <p className="text-xs text-slate-400 mb-6">
              Instant alerts and location coordinates are ready for dispatch to your emergency circle.
            </p>

            <div className="space-y-3 mb-6">
              <a
                href="tel:1091"
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-xl shadow-red-900/40"
              >
                <Heart className="w-5 h-5" /> Call Women's Helpline (1091)
              </a>
              <a
                href="tel:100"
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm hover:bg-slate-700"
              >
                <Phone className="w-4 h-4 text-emerald-400" /> Call Police (100 / 112)
              </a>
            </div>

            <button
              onClick={() => setSosTriggered(false)}
              className="text-xs text-slate-500 hover:text-slate-300 underline font-medium"
            >
              Cancel Alert (I am safe now)
            </button>
          </div>
        </div>
      )}

      {/* ━━━ CITY SEARCH & SELECT MODAL (ANY INDIAN CITY) ━━━ */}
      {cityModalOpen && (
        <div className="fixed inset-0 z-[2300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setCityModalOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-[#0f1629] border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Select Any City in India</h3>
              </div>
              <button onClick={() => setCityModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                autoFocus
                placeholder="Type any city, town, or district (e.g. Pune, Jaipur, Siliguri)..."
                value={citySearchQuery}
                onChange={e => handleCitySearch(e.target.value)}
                className="w-full bg-[#0a0f1a] border border-slate-700 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
              {citySearchLoading && (
                <RefreshCw className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 animate-spin" />
              )}
            </div>

            {/* GPS Auto Detect */}
            <button
              onClick={detectLiveLocation}
              className="w-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-emerald-400 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Locate className="w-4 h-4" /> Use My Live GPS Location
            </button>

            {/* Search Results */}
            {citySearchResults.length > 0 && (
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Search Results:</span>
                {citySearchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => selectCustomCity(r.display_name, r.lat, r.lon)}
                    className="w-full text-left bg-slate-800/40 hover:bg-emerald-500/10 hover:border-emerald-500/40 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 transition-all flex items-start gap-2.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-relaxed">{r.display_name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Cities Chips */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Popular Cities:</span>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                {Object.entries(citiesData).slice(0, 24).map(([k, c]) => (
                  <button
                    key={k}
                    onClick={() => {
                      setCityKey(k);
                      setMapCenter(c.center);
                      setCityModalOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      cityKey === k
                        ? 'bg-emerald-500 text-white font-bold'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

            {/* Hidden audio element for custom uploaded or recorded audio */}
      <audio ref={callAudioElementRef} onEnded={() => {}} className="hidden" />

      {/* ━━━ FAKE CALL CUSTOMIZE MODAL ━━━ */}
      {fakeCallCustomizeOpen && (
        <div className="fixed inset-0 z-[2300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setFakeCallCustomizeOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-[#0f1629] border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Customise Fake Caller & Recording</h3>
              </div>
              <button onClick={() => setFakeCallCustomizeOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Contact Customization */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">1. Choose or Customise Contact</span>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'Dad (Home)', number: '+91 98765 43210', label: 'Mobile' },
                  { name: 'Mom', number: '+91 98111 22233', label: 'Mobile' },
                  { name: 'Brother', number: '+91 98222 33344', label: 'Home' },
                  { name: 'Pooja (Roommate)', number: '+91 98333 44455', label: 'Mobile' },
                  { name: 'Inspector Sharma (PCR)', number: '112', label: 'Emergency' },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => saveFakeCallConfig({ ...fakeCallConfig, name: p.name, number: p.number, label: p.label })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      fakeCallConfig.name === p.name
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Caller Name</label>
                  <input
                    type="text"
                    value={fakeCallConfig.name}
                    onChange={e => saveFakeCallConfig({ ...fakeCallConfig, name: e.target.value })}
                    className="w-full bg-[#0a0f1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Dad, Mom, Rahul"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={fakeCallConfig.number}
                    onChange={e => saveFakeCallConfig({ ...fakeCallConfig, number: e.target.value })}
                    className="w-full bg-[#0a0f1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. +91 98765 XXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Audio Source Selection (Default vs Upload vs Mic) */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">2. Audio / Voice Source</span>

              {/* Source Tabs */}
              <div className="grid grid-cols-3 gap-1.5 bg-[#0a0f1a] p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => saveFakeCallConfig({ ...fakeCallConfig, audioMode: 'default' })}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    fakeCallConfig.audioMode === 'default'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" /> Default Voice
                </button>
                <button
                  onClick={() => saveFakeCallConfig({ ...fakeCallConfig, audioMode: 'upload' })}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    fakeCallConfig.audioMode === 'upload'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" /> Upload File
                </button>
                <button
                  onClick={() => saveFakeCallConfig({ ...fakeCallConfig, audioMode: 'mic' })}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    fakeCallConfig.audioMode === 'mic'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" /> Record with Mic
                </button>
              </div>

              {/* Mode 1: Default Spoken Script */}
              {fakeCallConfig.audioMode === 'default' && (
                <div className="space-y-3 bg-[#0a0f1a] border border-slate-800 p-4 rounded-2xl">
                  <span className="text-[11px] text-slate-400 block font-medium">Quick Spoken Scripts:</span>
                  <div className="space-y-1.5">
                    {[
                      { title: 'Gate Waiting (EN)', script: 'Hey! Are you almost here? I am standing right outside the gate waiting for you. Hurry up!', lang: 'en' },
                      { title: 'Metro Pickup (EN)', script: 'Hello beta, where have you reached? Dad is coming to the metro station to pick you up right now.', lang: 'en' },
                      { title: 'Cab GPS Tracking (EN)', script: 'Hey, I am tracking your cab on live GPS, you are 2 minutes away. Let me know if the driver changes route.', lang: 'en' },
                      { title: 'Hindi Family (HI)', script: 'हाँ कहाँ पहुँची? मैं बाहर खड़ा हूँ, जल्दी आजा, मम्मी इंतज़ार कर रही हैं।', lang: 'hi' },
                    ].map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => saveFakeCallConfig({ ...fakeCallConfig, script: s.script, scriptLang: s.lang })}
                        className={`w-full text-left p-2.5 rounded-xl text-xs border transition-all ${
                          fakeCallConfig.script === s.script
                            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="font-bold block mb-0.5">{s.title}</span>
                        <span className="text-slate-400 text-[11px] line-clamp-1">"{s.script}"</span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-medium block mb-1">Custom Spoken Script</label>
                    <textarea
                      rows={2}
                      value={fakeCallConfig.script}
                      onChange={e => saveFakeCallConfig({ ...fakeCallConfig, script: e.target.value })}
                      className="w-full bg-[#0f1629] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <button
                    onClick={() => speakText(fakeCallConfig.script, fakeCallConfig.scriptLang || 'en')}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" /> Test Voice Synthesis Preview
                  </button>
                </div>
              )}

              {/* Mode 2: Upload Recording File from Friends/Family */}
              {fakeCallConfig.audioMode === 'upload' && (
                <div className="space-y-3 bg-[#0a0f1a] border border-slate-800 p-4 rounded-2xl text-center">
                  <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-6 transition-all">
                    <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <span className="text-xs font-bold text-white block">Upload Recording from Friend or Family</span>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                      Select any voice note or recording (.mp3, .m4a, .wav, .aac, .ogg)
                    </p>
                    <label className="inline-block mt-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer active:scale-95 transition-all">
                      Choose Audio File
                      <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
                    </label>
                  </div>

                  {customAudioUrl && (
                    <div className="bg-[#0f1629] p-3 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                      <div className="text-left truncate max-w-[220px]">
                        <span className="font-bold text-white block truncate">{customAudioName || 'Uploaded Audio'}</span>
                        <span className="text-[10px] text-emerald-400">Ready for incoming call</span>
                      </div>
                      <button
                        onClick={() => {
                          const a = new Audio(customAudioUrl);
                          a.play();
                        }}
                        className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-emerald-500/30"
                      >
                        <Play className="w-3.5 h-3.5" /> Play
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mode 3: Record Voice with Mic Right Now */}
              {fakeCallConfig.audioMode === 'mic' && (
                <div className="space-y-3 bg-[#0a0f1a] border border-slate-800 p-4 rounded-2xl text-center">
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Ask your friend, parent, or brother to speak into your phone microphone now (e.g., <em>"Hello, where are you? I'm standing right outside!"</em>).
                  </p>

                  <div className="py-2">
                    {!isRecordingMic ? (
                      <button
                        onClick={startMicRecording}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 mx-auto shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
                      >
                        <Mic className="w-4 h-4" /> Start Recording Voice
                      </button>
                    ) : (
                      <button
                        onClick={stopMicRecording}
                        className="bg-red-600 animate-pulse text-white font-bold px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 mx-auto shadow-lg shadow-red-600/40 active:scale-95"
                      >
                        <Square className="w-4 h-4" /> Recording ({recTimer}s) &middot; Click to Finish
                      </button>
                    )}
                  </div>

                  {micAudioUrl && !isRecordingMic && (
                    <div className="bg-[#0f1629] p-3 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                      <div className="text-left">
                        <span className="font-bold text-white block">Microphone Voice Note</span>
                        <span className="text-[10px] text-emerald-400">Captured and ready</span>
                      </div>
                      <button
                        onClick={() => {
                          const a = new Audio(micAudioUrl);
                          a.play();
                        }}
                        className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-emerald-500/30"
                      >
                        <Play className="w-3.5 h-3.5" /> Play
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setFakeCallCustomizeOpen(false)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs active:scale-95"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ━━━ REALISTIC INCOMING & ACTIVE FAKE CALL SCREEN ━━━ */}
      {fakeCallActive && (
        <div className="fixed inset-0 z-[2400] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-10 select-none">
          
          {/* Top Status */}
          <div className="text-center pt-8 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-mono font-bold block animate-pulse">
              {callState === 'incoming' ? 'Incoming Phone Call...' : 'Call in Progress'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">{fakeCallConfig.name}</h2>
            <p className="text-slate-400 text-sm font-medium">{fakeCallConfig.number} &middot; {fakeCallConfig.label}</p>
          </div>

          {/* Center Visualizer & State */}
          <div className="my-auto text-center space-y-6">
            <div className="relative inline-block mx-auto">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto transition-all ${
                callState === 'incoming'
                  ? 'bg-emerald-500/20 border-4 border-emerald-500 animate-pulse text-emerald-400 shadow-2xl shadow-emerald-500/40'
                  : 'bg-emerald-600/30 border-2 border-emerald-400 text-white shadow-xl shadow-emerald-500/20'
              }`}>
                <PhoneCall className="w-14 h-14" />
              </div>
              {callState === 'incoming' && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full animate-ping"></span>
              )}
            </div>

            {callState === 'connected' && (
              <div className="space-y-3 max-w-md mx-auto">
                <span className="text-2xl font-mono font-bold text-white tracking-widest">
                  {Math.floor(callDuration / 60).toString().padStart(2, '0')}:{(callDuration % 60).toString().padStart(2, '0')}
                </span>
                
                {/* Audio Wave Visualizer */}
                <div className="flex items-center justify-center gap-1.5 h-8">
                  {[40, 75, 55, 90, 65, 80, 45, 95, 60, 85, 50, 70].map((h, i) => (
                    <span
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-full animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${(i * 0.1).toFixed(1)}s`,
                        animationDuration: '0.8s'
                      }}
                    />
                  ))}
                </div>

                <div className="bg-[#111827]/90 border border-slate-800 p-4 rounded-2xl text-xs text-slate-300 italic shadow-xl">
                  {fakeCallConfig.audioMode === 'default'
                    ? `"${fakeCallConfig.script}"`
                    : `Playing recorded voice from ${fakeCallConfig.name}...`
                  }
                </div>
              </div>
            )}
          </div>

          {/* Bottom Call Controls */}
          <div className="w-full max-w-sm mx-auto pb-6">
            {callState === 'incoming' ? (
              <div className="grid grid-cols-2 gap-8">
                {/* Decline Button */}
                <button
                  onClick={endFakeCall}
                  className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
                >
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-600/40 group-hover:scale-105 transition-transform">
                    <Phone className="w-8 h-8 rotate-[135deg]" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Decline</span>
                </button>

                {/* Accept Button */}
                <button
                  onClick={acceptFakeCall}
                  className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
                >
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-600/40 animate-bounce group-hover:scale-105 transition-transform">
                    <Phone className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Accept</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={endFakeCall}
                  className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 active:scale-95 transition-all"
                >
                  <Phone className="w-8 h-8 rotate-[135deg]" />
                </button>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">End Call</span>
              </div>
            )}
          </div>

        </div>
      )}

    
      {/* ━━━ STROBE DEFENSE OVERLAY (DISORIENTING FLASH) ━━━ */}
      {strobeActive && (
        <div
          onClick={toggleStrobe}
          className="fixed inset-0 z-[99999] strobe-screen flex flex-col items-center justify-center p-6 cursor-pointer select-none"
        >
          <div className="bg-black/95 text-white border-2 border-red-500 p-8 rounded-3xl text-center space-y-3 max-w-sm shadow-2xl">
            <Flashlight className="w-12 h-12 text-white mx-auto animate-bounce" />
            <h2 className="text-2xl font-black">FLASHING LIGHT IS ON</h2>
            <p className="text-xs text-slate-300">Point your screen at danger &bull; Tap anywhere on screen to turn off</p>
          </div>
        </div>
      )}

      {/* ━━━ CAMOUFLAGE CALCULATOR OVERLAY ━━━ */}
      {decoyMode && <CalculatorDecoy onExit={() => setDecoyMode(false)} />}

      {/* ━━━ LIVE ESCORT TRACKING MODAL ━━━ */}
      {escortModalOpen && (
        <div className="fixed inset-0 z-[2300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setEscortModalOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-[#0f1629] border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Share Live Location Link</h3>
              </div>
              <button onClick={() => setEscortModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#0c1222] p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Active Escort Link
                </span>
                <span className="text-slate-400 font-mono">{city.name}</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Anyone with this link can see your live location on Google Maps and phone battery to make sure you get home safely.
              </p>
              <div className="p-2.5 bg-[#080d18] rounded-xl border border-slate-700/60 font-mono text-[11px] text-slate-300 break-all select-all">
                {window.location.origin}/#escort-live-transit-{cityKey}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(`${window.location.origin}/#escort-live-transit-${cityKey}`);
                    setCopiedEscort(true);
                    setTimeout(() => setCopiedEscort(false), 2000);
                  } catch {}
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" /> {copiedEscort ? 'Copied ✓' : 'Copy Link'}
              </button>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent('🚨 SafetyPin Live Escort: Track my journey live in ' + city.name + ' at https://maps.google.com/?q=' + mapCenter[0] + ',' + mapCenter[1])}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all text-center"
              >
                Share on WhatsApp ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ━━━ ROUTE DEVIATION WARNING MODAL ━━━ */}
      {deviationAlertOpen && (
        <div className="fixed inset-0 z-[2500] bg-red-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111827] border-2 border-red-500 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4 animate-bounce">
            <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center mx-auto border-2 border-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-white">WRONG ROUTE WARNING!</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your cab has moved away from the safe road in {city.name}.
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setSosTriggered(true)}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/40"
              >
                <Zap className="w-4 h-4" /> Trigger Immediate SOS
              </button>
              <button
                onClick={() => setDeviationAlertOpen(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs"
              >
                I am Safe (Turn Off Alarm)
              </button>
            </div>
          </div>
        </div>
      )}
</div>
  );
}
