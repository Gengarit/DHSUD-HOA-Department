import { useEffect, useState } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

// --- ICON COMPONENTS ---
const NavDashboardIcon = () => (<svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>);
const NavFolderIcon = () => (<svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>);
const NavArchiveIcon = () => (<svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>);
const EditIcon = () => (<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>);
const ArchiveIcon = () => (<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>);
const RestoreIcon = () => (<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>);
const TrashIcon = () => (<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const SearchIcon = () => (<svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const ViewIcon = () => (<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>);

// --- CONSTANTS & INITIAL LOCATION DATA ---
const projTypeOptionsList = [
  "OM Subd", "OM Condo", "MCH Subd", "MCH Condo", 
  "EH Subd", "EH Condo", "SH Subd", "SH Condo", 
  "MP", "COL/OS", "Commercial Condo", "Industrial Subd", 
  "Commercial Subd", "Farmlot Subd"
];

const crlsOptionsList = [
  "New LS", "New CR", "Amended LS", "Amended CR", 
  "Replacement of LS", "Replacement of CR", "Compliance Entry Only"
];

const initialNirLocations: Record<string, Record<string, string[]>> = {
  "Negros Occidental": {
    "Bacolod City": ["Alangilan", "Alijis", "Banago", "Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6", "Barangay 7", "Barangay 8", "Barangay 9", "Barangay 10", "Barangay 11", "Barangay 12", "Barangay 13", "Barangay 14", "Barangay 15", "Barangay 16", "Barangay 17", "Barangay 18", "Barangay 19", "Barangay 20", "Barangay 21", "Barangay 22", "Barangay 23", "Barangay 24", "Barangay 25", "Barangay 26", "Barangay 27", "Barangay 28", "Barangay 29", "Barangay 30", "Barangay 31", "Barangay 32", "Barangay 33", "Barangay 34", "Barangay 35", "Barangay 36", "Barangay 37", "Barangay 38", "Barangay 39", "Barangay 40", "Barangay 41", "Bata", "Cabug", "Estefania", "Felisa", "Granada", "Handumanan", "Mandalagan", "Mansilingan", "Montevista", "Pahanocoy", "Punta Taytay", "Singcang-Airport", "Sum-ag", "Taculing", "Tangub", "Villamonte", "Vista Alegre"],
    "Bago City": ["Abuanan", "Alianza", "Atipuluan", "Bacong-Montilla", "Bagroy", "Balingasag", "Binubuhan", "Busay", "Calumangan", "Dulao", "Ilijan", "Lag-asan", "Ma-ao", "Mabini", "Mailum", "Malingin", "Napoles", "Pacol", "Poblacion", "Sagasa", "Sampinit", "Tabunan", "Taloc"],
    "Binalbagan": ["Amontay", "Bagroy", "Bi-ao", "Canmoros", "Enclaro", "Marina", "Pagla-um", "Payao", "Progreso", "San Jose", "San Juan", "San Pedro", "San Teodoro", "San Vicente", "Santo Rosario", "Santol"],
    "Cadiz City": ["Andres Bonifacio", "Banquerohan", "Barangay 1 Pob. (Zone 1)", "Barangay 2 Pob. (Zone 2)", "Barangay 3 Pob. (Zone 3)", "Barangay 4 Pob. (Zone 4)", "Barangay 5 Pob. (Zone 5)", "Barangay 6 Pob. (Zone 6)", "Burgos", "Cabahug", "Cadiz Viejo", "Caduha-an", "Celestino Villacin", "Daga", "V. F. Gustilo", "Jerusalem", "Luna", "Mabini", "Magsaysay", "Sicaba", "Tiglawigan", "Tinampa-an"],
    "Calatrava": ["Agboy", "Alimango", "Ani-e", "Bagacay", "Bantayanon", "Buenavista", "Cabungahan", "Calampisawan", "Cambayobo", "Castellano", "Cruz", "Dolis", "Hilub-Ang", "Hinab-Ong", "Igmaya-an", "Ilaya", "Laga-an", "Lemery", "Lipat-on", "Lo-ok", "Ma-aslob", "Macasilao", "Mahilum", "Malanog", "Malatas", "Marcelo", "Menchaca", "Mina-utok", "Minapasuk", "Pantao", "Patun-an", "Pinocutan", "Poblacion", "Refugio", "San Isidro", "Suba", "Telong", "Tigbao", "Tigbon", "Winu-an"],
    "Candoni": ["Agboy", "Bangkaya", "Cabia-an", "Caningay", "Gatuslao", "Haba", "Payauan", "Poblacion East", "Poblacion West"],
    "Cauayan": ["Abaca", "Baclao", "Basak", "Bulata", "Caliling", "Camalanda-an", "Camindangan", "Elihan", "Guiljungan", "Inayawan", "Isio", "Linaon", "Lumbia", "Mambugsay", "Man-Uling", "Masaling", "Molobolo", "Poblacion", "Sura", "Talacdan", "Tambad", "Tiling", "Tomina", "Tuyom", "Yahong"],
    "Enrique B. Magalona": ["Alacaygan", "Alicante", "Batea", "Canlusong", "Consing", "Cudangdang", "Damgo", "Gahit", "Latasan", "Madrigal", "Manta-angan", "Nanca", "Pasiano", "Poblacion I", "Poblacion II", "Poblacion III", "San Isidro", "San Jose", "Santo Niño", "Tabigue", "Tanza", "Tomongtong", "Tuburan"],
    "Escalante City": ["Alimango", "Balintawak", "Binaguiohan", "Buenavista", "Cervantes", "Dian-ay", "Hacienda Fe", "Japitan", "Jonobjonob", "Langub", "Libertad", "Mabini", "Magsaysay", "Malasibog", "Old Poblacion", "Paitan", "Pinapugasan", "Rizal", "Tamlang", "Udtongan", "Washington"],
    "Himamaylan City": ["Aguisan", "Barangay I (Pob.)", "Barangay II (Pob.)", "Barangay III (Pob.)", "Barangay IV (Pob.)", "Buenavista", "Cabadiangan", "Cabanbanan", "Carabalan", "Libacao", "Mahalang", "Mambagaton", "Nabali-an", "San Antonio", "Saraet", "Su-ay", "Talaban", "To-oy"],
    "Hinigaran": ["Anahaw", "Aranda", "Baga-as", "Barangay I (Pob.)", "Barangay II (Pob.)", "Barangay III (Pob.)", "Barangay IV (Pob.)", "Bato", "Camba-og", "Candumarao", "Gargato", "Himaya", "Miranda", "Nanunga", "Narra", "Palayog", "Paticui", "Pilar", "Quiwi", "Tagda", "Tulunan"],
    "Hinoba-an": ["Alim", "Asia", "Bacuyangan", "Barangay I (Pob.)", "Barangay II (Pob.)", "Bulwangan", "Culasi", "Damutan", "Daug", "Pook", "San Rafael", "Sangke", "Talacagay"],
    "Ilog": ["Andulauan", "Balicotoc", "Barangay I (Pob.)", "Barangay II (Pob.)", "Bocana", "Calubang", "Canlamay", "Consuelo", "Dancalan", "Delicioso", "Galicia", "Manalad", "Pinggot", "Tabu", "Vista Alegre"],
    "Isabela": ["Amin", "Banogpe", "Bulad", "Bungahin", "Cabcab", "Camangcamang", "Campuyo", "Cansalongon", "Crossing Magallon", "Guintubhan", "Limalima", "Makilignit", "Mansablay", "Mayatik", "Nayon", "Panaquiao", "Poblacion 1", "Poblacion 2", "Poblacion 3", "Poblacion 4", "Poblacion 5", "Poblacion 6", "Poblacion 7", "Poblacion 8", "Poblacion 9", "Riverside", "Rumirang", "San Agustin", "Sebucauan", "Sikatuna", "Tinongan"],
    "Kabankalan City": ["Bantayan", "Barangay 1 (Pob.)", "Barangay 2 (Pob.)", "Barangay 3 (Pob.)", "Barangay 4 (Pob.)", "Barangay 5 (Pob.)", "Barangay 6 (Pob.)", "Barangay 7 (Pob.)", "Barangay 8 (Pob.)", "Barangay 9 (Pob.)", "Binicuil", "Camingawan", "Camugao", "Carol-an", "Colonia Divina", "Daan Banua", "Dacongcogon", "Florentino Galang", "Hilamonan", "Inapoy", "Locotan", "Magballo", "Oringao", "Orong", "Pinaguinpinan", "Salong", "Tabugon", "Tagoc", "Talubangi", "Tampalon", "Tan-Awan", "Tapi"],
    "La Carlota City": ["Alegria", "Ara-al", "Ayungon", "Balabag", "Barangay I (Pob.)", "Barangay II (Pob.)", "Barangay III (Pob.)", "Batuan", "Consuelo", "Cubay", "Haguimit", "La Granja", "Nagasi", "RSB", "San Miguel", "Yubo"],
    "La Castellana": ["Biaknabato", "Cabacungan", "Cabagnaan", "Camandag", "Iglaw-an", "Lalagsan", "Manghanoy", "Mansalanao", "Masulog", "Nato", "Poblacion", "Puso", "Sag-Ang", "Talaptap"],
    "Manapla": ["Barangay I (Pob.)", "Barangay II (Pob.)", "Barangay II-A (Pob.)", "Burgos", "Chambery", "Makatunao", "Punta Mesa", "Punta Salong", "Purisima", "San Pablo", "Santa Teresa", "Tortosa"],
    "Moises Padilla": ["Barangay 1 (Pob.)", "Barangay 2 (Pob.)", "Barangay 3 (Pob.)", "Barangay 4 (Pob.)", "Barangay 5 (Pob.)", "Barangay 6 (Pob.)", "Barangay 7 (Pob.)", "Crossing Magallon", "Guinpana-an", "Inolingan", "Macagahay", "Magallon Cadre", "Montilla", "Odoc", "Quintin Salas"],
    "Murcia": ["Abo-abo", "Alegria", "Amayco", "Aning", "Blumentritt", "Buenavista", "Caliban", "Canlandog", "Cansilayan", "Damsite", "Iglau-an", "Lopez Jaena", "Minoyan", "Pandanon", "San Miguel", "Santa Cruz", "Santa Rosa", "Zone I (Pob.)", "Zone II (Pob.)", "Zone III (Pob.)", "Zone IV (Pob.)", "Zone V (Pob.)"],
    "Pontevedra": ["Antipolo", "Barangay I (Pob.)", "Barangay II (Pob.)", "Barangay III (Pob.)", "Buenavista", "Buenavista Rizal", "Burgos", "Cambarus", "Canroma", "Don Salvador Benedicto", "General Malvar", "Gomez", "M. H. Del Pilar", "Mabini", "Miranda", "Pandan", "Recreo", "San Isidro", "San Juan", "Zamora"],
    "Pulupandan": ["Culo", "Mabini", "Mabuhay", "Palaka Norte", "Palaka Sur", "Pating", "Tagda", "Tapadlan", "Ubay", "Utod", "Zone 1", "Zone 1-A", "Zone 2", "Zone 3", "Zone 4", "Zone 4-A", "Zone 5", "Zone 6", "Zone 7"],
    "Sagay City": ["Andres Bonifacio", "Bato", "Baviera", "Bulanon", "Campo Himoga-an", "Colonia Divina", "Fabrica", "General Luna", "Himoga-an Baybay", "Lopez Jaena", "Malubon", "Maquiling", "Molocaboc", "Old Sagay", "Paraiso", "Plaridel", "Poblacion 1", "Poblacion 2", "Poblacion 3", "Poblacion 4", "Rizal", "Taba-ao", "Tadlong", "Vito"],
    "Salvador Benedicto": ["Bago", "Bunga", "Igwakang", "Kumaliskis", "Nayon", "Pandanon", "Pinowayan"],
    "San Carlos City": ["Bagonbon", "Barangay 1 (Pob.)", "Barangay 2 (Pob.)", "Barangay 3 (Pob.)", "Barangay 4 (Pob.)", "Barangay 5 (Pob.)", "Barangay 6 (Pob.)", "Buluangan", "Codcod", "Ermita", "Guadalupe", "Nataban", "Palampas", "Prosperidad", "Punao", "Quezon", "Rizal", "San Juan"],
    "San Enrique": ["Bagonawa", "Baliwagan", "Batuan", "Guintorilan", "Nayom", "Poblacion", "Sibucao", "Tabao Baybay", "Tabao Rizal", "Tibsoc"],
    "Silay City": ["Bagtic", "Balaring", "Barangay I (Pob.)", "Barangay II (Pob.)", "Barangay III (Pob.)", "Barangay IV (Pob.)", "Barangay V (Pob.)", "E. Lopez", "Guimbala-on", "Guinhalaran", "Hawaiian", "Kapitan Ramon", "Lantad", "Mambulac", "Patag", "Rizal"],
    "Sipalay City": ["Barangay 1 (Pob.)", "Barangay 2 (Pob.)", "Barangay 3 (Pob.)", "Barangay 4 (Pob.)", "Barangay 5 (Pob.)", "Cabadiangan", "Camindangan", "Canturay", "Cartagena", "Cayhawan", "Gil Montilla", "Mambaroto", "Manlucahoc", "Maricalum", "Nabulao", "Nauhang", "San Jose"],
    "Talisay City": ["Alegria", "Bubog", "Cabatangan", "Campuestohan", "Catabla", "Concepcion", "Dos Hermanas", "Efigenio Lizares", "Matab-ang", "Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 4-A", "Zone 5", "Zone 6", "Zone 7", "Zone 8", "Zone 9", "Zone 10", "Zone 11", "Zone 12", "Zone 12-A", "Zone 14", "Zone 14-A", "Zone 14-B", "Zone 15"],
    "Toboso": ["Bandila", "Bug-ang", "General Luna", "Magticol", "Poblacion", "Ramon Benedicto", "San Isidro", "San Jose", "Tabun-ac"],
    "Valladolid": ["Alijis", "Ayungon", "Baghig", "Batuan", "Bayabas", "Central Tabao", "Doldol", "Guintorilan", "Lacaron", "Mabini", "Pacol", "Palaka", "Paloma", "Poblacion", "Sagua Banua", "Tabao Proper"],
    "Victorias City": ["Barangay I", "Barangay II", "Barangay III", "Barangay IV", "Barangay V", "Barangay VI", "Barangay VI-A", "Barangay VII", "Barangay VIII", "Barangay IX", "Barangay X", "Barangay XI", "Barangay XII", "Barangay XIII", "Barangay XIV", "Barangay XV", "Barangay XVI", "Barangay XVI-A", "Barangay XVII", "Barangay XVIII", "Barangay XVIII-A", "Barangay XIX", "Barangay XIX-A", "Barangay XX", "Barangay XXI"]
  },
  "Negros Oriental": {
    "Dumaguete City": ["Bagacay", "Bajumpandan", "Balugo", "Banilad", "Bantayan", "Batinguel", "Buñao", "Cadawinonan", "Calindagan", "Camanjac", "Candau-ay", "Cantil-e", "Daro", "Junob", "Looc", "Mangnao-Canal", "Motong", "Piapi", "Pulantubig", "Tabuctubig", "Taclobo", "Talay"],
    "Bais City": ["Basa", "Cabanlutan", "Calasga-an", "Cambagahan", "Cangmating", "Cansaloma", "Capinahan", "Consolacion", "Dansulan", "Dawis", "Hangyad", "La Paz", "Lo-oc", "Lonoy", "Mabunao", "Medalla Milagrosa", "Olympia", "Okiot", "Panalaan", "Panam-angan", "Poblacion", "Sab-ahan", "San Isidro", "Tagpo", "Talungon", "Tamisu"],
    "Bayawan City": ["Ali-is", "Banaybanay", "Bangkaya", "Boyco", "Bugay", "Cansumalig", "Dawis", "Kalamtukan", "Kalumboyan", "Malabugas", "Manduao", "Maninihon", "Minaba", "Nangka", "Narra", "Pagatban", "Poblacion", "San Jose", "San Miguel", "San Roque", "Suba", "Tayawan", "Villareal"],
    "Canlaon City": ["Aquino", "Binalbagan", "Bucamac", "Budlasan", "Linothangan", "Lumapao", "Mabigo", "Malaiba", "Masulog", "Ninoy Aquino", "Panca", "Panubigan"],
    "Guihulngan City": ["Bakid", "Balogo", "Banwague", "Basak", "Binobohan", "Buenavista", "Bulado", "Calamba", "Hilaitan", "Hinakpan", "Humaycol", "Imelda", "Kagawasan", "Linantuyan", "Luz", "Mabunga", "Magsaysay", "Malusay", "Maniak", "Mckinley", "Nagsaha", "Planas", "Poblacion", "Sandayao", "Tacpao", "Trinidad", "Tubod", "Villegas"],
    "Tanjay City": ["Azagra", "Bahi-an", "Luca", "Mancilang", "Novallas", "Obi", "Pal-ew", "Poblacion 1", "Poblacion 2", "Poblacion 3", "Poblacion 4", "Poblacion 5", "Poblacion 6", "Poblacion 7", "Poblacion 8", "Poblacion 9", "Polo", "San Isidro", "San Jose", "San Miguel", "Santa Cruz", "Santo Niño", "Tugas"]
  },
  "Siquijor": {
    "Siquijor (Capital)": ["Banban", "Bolos", "Caipilan", "Caitican", "Calalinan", "Canal", "Candanay Norte", "Candanay Sur", "Cang-adieng", "Cang-agong", "Cang-alwang", "Cang-asa", "Cang-atuyom", "Cang-inte", "Cang-isad", "Canghunoghunog", "Cangmatnog", "Cangmohao", "Cantabon", "Caticugan", "Dumanhog", "Ibabao", "Lambojon", "Luyang", "Luzong", "Olo", "Pangi", "Panlautan", "Pasihagon", "Pili", "Poblacion", "Polangyuta", "Ponong", "Sabang", "San Antonio", "Songculan", "Tacdog", "Tacloban", "Tambisan", "Tebjong", "Tinago", "Tongo"],
    "Larena": ["Bagacay", "Balolang", "Basac", "Bintangan", "Bontod", "Cabulihan", "Calunasan", "Candigum", "Cang-allas", "Cang-apa", "Cangbagsa", "Cangmalalag", "Canlambo", "Canlasog", "Catamboan", "Helen", "Nonoc", "North Poblacion", "Ponong", "Sabang", "Sandugan", "South Poblacion", "Taculing"],
    "Lazi": ["Campalanas", "Cangclaran", "Cangomantong", "Capalasanan", "Catamboan", "Gabayan", "Kimba", "Kinamandagan", "Lower Cabangcalan", "Nagerong", "Po-o", "Simacolong", "Tagmanocan", "Talayong", "Tigbawan", "Tignao", "Upper Cabangcalan", "Ytaya"],
    "Maria": ["Bogo", "Bonga", "Cabal-asan", "Calunasan", "Candaping A", "Candaping B", "Cantaroc A", "Cantaroc B", "Cantugbas", "Lico-an", "Lilo-an", "Logucan", "Looc", "Minalulan", "Nabutay", "Olang", "Pisong A", "Pisong B", "Poblacion Norte", "Poblacion Sur", "Saguing", "Sawang"],
    "San Juan": ["Canasagan", "Candura", "Cangmunag", "Cansayang", "Catulayan", "Lala-o", "Maite", "Napo", "Paliton", "Poblacion", "Solangon", "Tag-ibo", "Tambisan", "Timbaon", "Tubod"],
    "Enrique Villanueva": ["Balolong", "Bino-ongan", "Bitaug", "Bolot", "Camogao", "Cangmangki", "Libo", "Lomangcapan", "Lotloton", "Manan-ao", "Olave", "Parian", "Poblacion", "Tulapos"]
  }
};

interface Application {
  id: number;
  name_of_proj: string;
  proj_owner_dev?: string; 
  status_of_application: string;
  type_of_application: string;
  cr_no: string;
  ls_no: string;
  proj_type: string;
  main_or_compliance: string;
  date_filed: string | null;
  date_issued: string | null;
  date_completion: string | null;
  prov: string;
  mun_city: string;
  street_brgy: string;
  crls_options?: string[];
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All') 
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'dashboard' | 'active' | 'archive'>('dashboard')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  
  // NEW: State for Viewing full project details
  const [viewingApp, setViewingApp] = useState<Application | null>(null)

  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isBulkMode, setIsBulkMode] = useState(false)
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean; title: string; message: string; action: (() => void) | null; confirmText: string; confirmColor: string;
  }>({
    show: false, title: '', message: '', action: null, confirmText: 'Confirm', confirmColor: 'bg-blue-600'
  })

  const [promptDialog, setPromptDialog] = useState<{
    show: boolean; title: string; message: string; placeholder: string; action: ((val: string) => void) | null;
  }>({
    show: false, title: '', message: '', placeholder: '', action: null
  })
  const [promptValue, setPromptValue] = useState('')

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  }

  const requestConfirm = (title: string, message: string, action: () => void, confirmText: string, confirmColor: string) => {
    setConfirmDialog({ show: true, title, message, action, confirmText, confirmColor });
  }

  const emptyForm = {
    name_of_proj: '',
    proj_owner_dev: '',
    status_of_application: 'Ongoing',
    type_of_application: 'New Application',
    cr_no: '',
    ls_no: '',
    proj_type: '',
    main_or_compliance: 'Main',
    date_filed: '',
    date_issued: '',
    date_completion: '',
    prov: '',
    mun_city: '',
    street_brgy: '',
    crls_options: [] as string[]
  }
  const [formData, setFormData] = useState(emptyForm)

  const [locationDB, setLocationDB] = useState<Record<string, Record<string, string[]>>>(() => {
    const saved = localStorage.getItem('dhsud_custom_locations');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed["Negros Occidental"] && parsed["Negros Occidental"]["Bacolod City"]) {
        const existingBacolod = parsed["Negros Occidental"]["Bacolod City"];
        const newBacolod = initialNirLocations["Negros Occidental"]["Bacolod City"];
        parsed["Negros Occidental"]["Bacolod City"] = Array.from(new Set([...existingBacolod, ...newBacolod])).sort();
      }
      return parsed;
    }
    return initialNirLocations;
  });

  useEffect(() => {
    localStorage.setItem('dhsud_custom_locations', JSON.stringify(locationDB));
  }, [locationDB]);

  const availableProvinces = Object.keys(locationDB);
  const availableCities = formData.prov ? Object.keys(locationDB[formData.prov] || {}).sort() : [];
  const availableBarangays = (formData.prov && formData.mun_city) ? (locationDB[formData.prov][formData.mun_city] || []).sort() : [];

  const handleAddCity = () => {
    if (!formData.prov) return;
    setPromptValue(''); 
    setPromptDialog({
      show: true, title: 'Add Municipality / City', message: `Add a new city or municipality to the list for ${formData.prov}.`, placeholder: 'e.g. Talisay City',
      action: (newCity) => {
        if (newCity && newCity.trim() !== '') {
          const cleanCity = newCity.trim();
          if (!locationDB[formData.prov][cleanCity]) {
            setLocationDB(prev => ({ ...prev, [formData.prov]: { ...prev[formData.prov], [cleanCity]: [] } }));
            setFormData(prev => ({ ...prev, mun_city: cleanCity, street_brgy: '' }));
            showNotification(`Added ${cleanCity} to the list!`, "success");
          } else {
            showNotification(`${cleanCity} already exists.`, "info");
          }
        }
      }
    });
  }

  const handleDeleteCity = () => {
    if (!formData.prov || !formData.mun_city) return;
    requestConfirm(
      "Delete City", `Are you sure you want to permanently delete '${formData.mun_city}' from ${formData.prov}?`, 
      () => {
        setLocationDB(prev => {
          const updatedProv = { ...prev[formData.prov] };
          delete updatedProv[formData.mun_city];
          return { ...prev, [formData.prov]: updatedProv };
        });
        setFormData(prev => ({ ...prev, mun_city: '', street_brgy: '' }));
        showNotification(`Deleted ${formData.mun_city}.`, "success");
      }, "Delete City", "bg-red-600 hover:bg-red-700"
    );
  }

  const handleAddBrgy = () => {
    if (!formData.prov || !formData.mun_city) return;
    setPromptValue(''); 
    setPromptDialog({
      show: true, title: 'Add Barangay', message: `Add a new barangay to the list for ${formData.mun_city}.`, placeholder: 'e.g. Zone 1',
      action: (newBrgy) => {
        if (newBrgy && newBrgy.trim() !== '') {
          const cleanBrgy = newBrgy.trim();
          if (!locationDB[formData.prov][formData.mun_city].includes(cleanBrgy)) {
            setLocationDB(prev => ({ ...prev, [formData.prov]: { ...prev[formData.prov], [formData.mun_city]: [...prev[formData.prov][formData.mun_city], cleanBrgy].sort() } }));
            setFormData(prev => ({ ...prev, street_brgy: cleanBrgy }));
            showNotification(`Added ${cleanBrgy} to the list!`, "success");
          } else {
            showNotification(`${cleanBrgy} already exists.`, "info");
          }
        }
      }
    });
  }

  const handleDeleteBrgy = () => {
    if (!formData.prov || !formData.mun_city || !formData.street_brgy) return;
    requestConfirm(
      "Delete Barangay", `Are you sure you want to permanently delete '${formData.street_brgy}' from ${formData.mun_city}?`, 
      () => {
        setLocationDB(prev => ({ ...prev, [formData.prov]: { ...prev[formData.prov], [formData.mun_city]: prev[formData.prov][formData.mun_city].filter(b => b !== formData.street_brgy) } }));
        setFormData(prev => ({ ...prev, street_brgy: '' }));
        showNotification(`Deleted ${formData.street_brgy}.`, "success");
      }, "Delete Barangay", "bg-red-600 hover:bg-red-700"
    );
  }

  // --- Strict Numeric & Dash Input handler ---
  const handleNumericDashInput = (e: React.ChangeEvent<HTMLInputElement>, field: 'cr_no' | 'ls_no') => {
    const value = e.target.value.replace(/[^0-9-]/g, '');
    setFormData({ ...formData, [field]: value });
  };

  const fetchApplications = () => {
    setIsLoading(true);
    axios.get('http://127.0.0.1:8000/api/applications/')
      .then(response => setApplications(response.data))
      .catch(error => {
        console.error("Error fetching data:", error);
        showNotification("Failed to load projects from server.", "error");
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    setSelectedIds([]);
    setIsBulkMode(false);
  }, [currentView, searchTerm, filterStatus]);

  const activeApps = applications.filter(app => app.status_of_application !== 'Archived')
  const archivedApps = applications.filter(app => app.status_of_application === 'Archived')
  const displayApps = currentView === 'active' ? activeApps : archivedApps

  const stats = {
    ongoing: activeApps.filter(a => a.status_of_application === 'Ongoing').length,
    approved: activeApps.filter(a => a.status_of_application === 'Approved').length,
    denied: activeApps.filter(a => a.status_of_application === 'Denied').length,
    endorsed: activeApps.filter(a => a.status_of_application === 'Endorsed to HREDRB').length,
  }

  const chartData = [
    { name: 'Ongoing', count: stats.ongoing, color: '#3b82f6' },
    { name: 'Approved', count: stats.approved, color: '#10b981' },
    { name: 'Endorsed', count: stats.endorsed, color: '#f59e0b' },
    { name: 'Denied', count: stats.denied, color: '#ef4444' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#64748b', '#ef4444'];
  
  const projTypeCounts = activeApps.reduce((acc, app) => {
    const type = app.proj_type || 'Unspecified';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.keys(projTypeCounts)
    .map((key) => ({ name: key, value: projTypeCounts[key] }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const filteredApps = displayApps.filter(app => {
    const matchesSearch = app.name_of_proj.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.mun_city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || app.status_of_application === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(filteredApps.map(app => app.id));
    else setSelectedIds([]);
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleBulkAction = (action: 'archive' | 'restore' | 'delete') => {
    if (selectedIds.length === 0) return;

    let title = ''; let message = ''; let confirmText = ''; let confirmColor = ''; let apiCall: (id: number) => Promise<any>;

    if (action === 'archive') {
      title = 'Archive Selected'; message = `Are you sure you want to archive ${selectedIds.length} projects?`; confirmText = 'Archive All'; confirmColor = 'bg-orange-500 hover:bg-orange-600'; apiCall = (id) => axios.patch(`http://127.0.0.1:8000/api/applications/${id}/`, { status_of_application: 'Archived' });
    } else if (action === 'restore') {
      title = 'Restore Selected'; message = `Are you sure you want to restore ${selectedIds.length} projects to Active?`; confirmText = 'Restore All'; confirmColor = 'bg-emerald-600 hover:bg-emerald-700'; apiCall = (id) => axios.patch(`http://127.0.0.1:8000/api/applications/${id}/`, { status_of_application: 'Ongoing' });
    } else {
      title = 'Delete Selected'; message = `Are you sure you want to permanently delete ${selectedIds.length} projects? This action cannot be undone.`; confirmText = 'Delete All'; confirmColor = 'bg-red-600 hover:bg-red-700'; apiCall = (id) => axios.delete(`http://127.0.0.1:8000/api/applications/${id}/`);
    }

    requestConfirm(title, message, () => {
      setIsLoading(true);
      Promise.all(selectedIds.map(id => apiCall(id)))
        .then(() => {
          fetchApplications(); setSelectedIds([]); setIsBulkMode(false); 
          showNotification(`Successfully processed ${selectedIds.length} projects.`, "success");
        })
        .catch(() => {
          fetchApplications(); showNotification("Some operations failed. Please try again.", "error");
        })
        .finally(() => setIsLoading(false));
    }, confirmText, confirmColor);
  };

  const handleExport = () => {
    const dataToExport = filteredApps.map(app => ({
      'Type of Application': app.type_of_application || '',
      'Status of Application': app.status_of_application || '',
      'New or Amended CRLS (Can choose many)': app.crls_options?.join(', ') || '',
      'Main or Compliance': app.main_or_compliance || '',
      'Date Filed': app.date_filed || '',
      'Date Issued': app.date_issued || '',
      'Date Completion': app.date_completion || '',
      'CR No.': app.cr_no || '',
      'LS No.': app.ls_no || '',
      'Name of Proj': app.name_of_proj || '',
      'Proj Owner Dev': app.proj_owner_dev || '', 
      'Prov': app.prov || '',
      'Mun/City': app.mun_city || '',
      'Street/Brgy': app.street_brgy || '',
      'Proj Type': app.proj_type || ''
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Projects");
    XLSX.writeFile(wb, `DHSUD_${currentView}_Export.xlsx`);
    showNotification("Export successfully downloaded!", "success");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const wb = XLSX.read(data, { type: 'array' }); 
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData: any[] = XLSX.utils.sheet_to_json(ws);

        if (jsonData.length === 0) {
          showNotification("The file appears to be empty.", "error"); return;
        }

        jsonData.forEach((row) => {
          axios.post('http://127.0.0.1:8000/api/applications/', {
            name_of_proj: row['Name of Proj'] || row['Project Name'] || 'Untitled Project', 
            proj_owner_dev: row['Proj Owner Dev'] || '', 
            proj_type: row['Proj Type'] || '',
            type_of_application: row['Type of Application'] || 'New Application',
            status_of_application: row['Status of Application'] || 'Ongoing',
            main_or_compliance: row['Main or Compliance'] || 'Main',
            prov: row['Prov'] || '',
            mun_city: row['Mun/City'] || '',
            street_brgy: row['Street/Brgy'] || '',
            cr_no: row['CR No.'] || row['CR No'] || '',
            ls_no: row['LS No.'] || row['LS No'] || '',
            crls_options: row['New or Amended CRLS (Can choose many)'] 
              ? row['New or Amended CRLS (Can choose many)'].split(',').map((s: string) => s.trim()) 
              : []
          })
          .then(() => fetchApplications())
          .catch(err => console.error("Import error:", err));
        });

        showNotification(`Successfully imported ${jsonData.length} records!`, "success");
      } catch (error) {
        showNotification("Failed to read file. Please check the format.", "error");
      }
      e.target.value = ''; 
    };
    reader.readAsArrayBuffer(file);
  };

  const handleOpenModal = (app: Application | null = null) => {
    if (app) {
      setEditingId(app.id)
      setFormData({
        name_of_proj: app.name_of_proj, proj_owner_dev: app.proj_owner_dev || '', status_of_application: app.status_of_application, type_of_application: app.type_of_application, cr_no: app.cr_no || '', ls_no: app.ls_no || '', proj_type: app.proj_type || '', main_or_compliance: app.main_or_compliance || 'Main', date_filed: app.date_filed || '', date_issued: app.date_issued || '', date_completion: app.date_completion || '', prov: app.prov || '', mun_city: app.mun_city || '', street_brgy: app.street_brgy || '', crls_options: app.crls_options || [] 
      })
    } else {
      setEditingId(null)
      setFormData(emptyForm)
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const payload: any = { 
      ...formData,
      date_filed: formData.date_filed === '' ? null : formData.date_filed,
      date_issued: formData.date_issued === '' ? null : formData.date_issued,
      date_completion: formData.date_completion === '' ? null : formData.date_completion,
    }

    const apiCall = editingId ? axios.patch(`http://127.0.0.1:8000/api/applications/${editingId}/`, payload) : axios.post('http://127.0.0.1:8000/api/applications/', payload);

    apiCall.then(() => {
        fetchApplications();
        setIsModalOpen(false);
        showNotification(editingId ? "Project updated successfully" : "New project created successfully", "success");
      })
      .catch(err => showNotification("Action failed! Check server connection.", "error"));
  }

  const handleSoftDelete = (id: number) => {
    requestConfirm("Archive Project", "Are you sure you want to move this project to the archives?", () => {
      axios.patch(`http://127.0.0.1:8000/api/applications/${id}/`, { status_of_application: 'Archived' })
        .then(() => { fetchApplications(); showNotification("Project successfully archived.", "success"); })
        .catch(() => showNotification("Failed to archive project.", "error"));
    }, "Archive Project", "bg-orange-500 hover:bg-orange-600");
  }

  const handleRestore = (id: number) => {
    requestConfirm("Restore Project", "Do you want to restore this project back to the active list?", () => {
      axios.patch(`http://127.0.0.1:8000/api/applications/${id}/`, { status_of_application: 'Ongoing' })
        .then(() => { fetchApplications(); showNotification("Project successfully restored.", "success"); })
        .catch(() => showNotification("Failed to restore project.", "error"));
    }, "Restore Project", "bg-emerald-600 hover:bg-emerald-700");
  }

  const handleHardDelete = (id: number) => {
    requestConfirm("Permanent Deletion", "Are you sure you want to permanently delete this project? This action cannot be undone.", () => {
      axios.delete(`http://127.0.0.1:8000/api/applications/${id}/`)
        .then(() => { fetchApplications(); showNotification("Project successfully deleted.", "success"); })
        .catch(() => showNotification("Failed to delete project.", "error"));
    }, "Delete Forever", "bg-red-600 hover:bg-red-700");
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 relative">
      
      {/* --- PREMIUM TOAST NOTIFICATION --- */}
      {toast.show && (
        <div className="fixed top-8 right-8 z-[100] min-w-[320px] max-w-md bg-white border border-slate-100 rounded-2xl shadow-2xl p-4 flex items-start gap-4 animate-in slide-in-from-top-8 fade-in duration-300">
          
          {/* Dynamic Icon Container */}
          <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 
            toast.type === 'error' ? 'bg-red-100 text-red-600' : 
            'bg-blue-100 text-blue-600'
          }`}>
            {toast.type === 'success' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            )}
            {toast.type === 'info' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
          </div>

          {/* Text Content */}
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-bold text-slate-800">
              {toast.type === 'success' ? 'Success!' : toast.type === 'error' ? 'Action Failed' : 'System Notice'}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>

          {/* Close Button */}
          <button 
            onClick={() => setToast({ ...toast, show: false })} 
            className="shrink-0 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* --- PROMPT DIALOG (For Adding City/Brgy) --- */}
      {promptDialog.show && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-[80]">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm p-8 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setPromptDialog({ ...promptDialog, show: false })} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="mx-auto mb-6 w-16 h-16 rounded-[20px] flex items-center justify-center bg-blue-50 text-blue-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 text-center mb-2">{promptDialog.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed text-center mb-6 px-2">{promptDialog.message}</p>

            <input 
              type="text" 
              autoFocus
              className="w-full mb-6 border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
              placeholder={promptDialog.placeholder}
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  promptDialog.action?.(promptValue);
                  setPromptDialog({ ...promptDialog, show: false });
                }
              }}
            />

            <div className="flex flex-col gap-3">
              <button onClick={() => { promptDialog.action?.(promptValue); setPromptDialog({ ...promptDialog, show: false }); }} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm">
                Add Location
              </button>
              <button onClick={() => setPromptDialog({ ...promptDialog, show: false })} className="w-full py-3.5 text-slate-700 bg-white border-[1.5px] border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-semibold text-sm transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRMATION DIALOG --- */}
      {confirmDialog.show && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-[70]">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm p-8 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setConfirmDialog({ ...confirmDialog, show: false })} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className={`mx-auto mb-6 w-16 h-16 rounded-[20px] flex items-center justify-center ${confirmDialog.confirmColor.includes('red') ? 'bg-red-50 text-red-500' : confirmDialog.confirmColor.includes('orange') ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
              {confirmDialog.confirmColor.includes('emerald') ? (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              )}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 text-center mb-3">{confirmDialog.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed text-center mb-8 px-2">{confirmDialog.message}</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => { confirmDialog.action?.(); setConfirmDialog({ ...confirmDialog, show: false }); }} className={`w-full py-3.5 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm ${confirmDialog.confirmColor}`}>
                {confirmDialog.confirmText}
              </button>
              <button onClick={() => setConfirmDialog({ ...confirmDialog, show: false })} className="w-full py-3.5 text-slate-700 bg-white border-[1.5px] border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-semibold text-sm transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full shadow-md z-40">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="shrink-0">
            <img src="/DHSUD_LOGO.png" alt="DHSUD Logo" className="w-12 h-12 object-contain" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide leading-none">HREDRD</h2>
            <p className="text-[10px] text-slate-400 font-medium leading-tight mt-1">
              Housing & Real Estate Dev. <br/> Regulation Division
            </p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-6">
          <button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-medium ${currentView === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800'}`}>
            <NavDashboardIcon /> Dashboard
          </button>
          <button onClick={() => setCurrentView('active')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-medium ${currentView === 'active' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800'}`}>
            <NavFolderIcon /> Active Projects
          </button>
          <button onClick={() => setCurrentView('archive')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-medium ${currentView === 'archive' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800'}`}>
            <NavArchiveIcon /> Archives
          </button>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-8 ml-64 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {currentView === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">System Dashboard</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ongoing</p>
                  <p className="text-3xl font-black text-slate-800">{stats.ongoing}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Approved</p>
                  <p className="text-3xl font-black text-slate-800">{stats.approved}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Endorsed to HREDRB</p>
                  <p className="text-3xl font-black text-slate-800">{stats.endorsed}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Denied</p>
                  <p className="text-3xl font-black text-slate-800">{stats.denied}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Application Status Breakdown</h3>
                  {isLoading ? (
                    <div className="h-72 flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div></div>
                  ) : (
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                          <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 600 }} />
                          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                            {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Projects by Type</h3>
                  {isLoading ? (
                    <div className="h-72 flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div></div>
                  ) : pieChartData.length === 0 ? (
                    <div className="h-72 flex items-center justify-center text-slate-400 text-sm font-medium">No project data available yet.</div>
                  ) : (
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieChartData} cx="50%" cy="45%" innerRadius={75} outerRadius={105} paddingAngle={4} dataKey="value" stroke="none">
                            {pieChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 600 }} formatter={(value: any, name: any): [string, string] => [`${value} Project${Number(value) > 1 ? 's' : ''}`, String(name)]} />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="text-slate-700 font-medium ml-1">{value}</span>} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {(currentView === 'active' || currentView === 'archive') && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{currentView === 'active' ? 'Project Registry' : 'Archived Records'}</h1>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => { setIsBulkMode(!isBulkMode); if (isBulkMode) setSelectedIds([]); }} className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm border ${isBulkMode ? 'bg-slate-700 hover:bg-slate-800 text-white border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'}`}>
                    {isBulkMode ? 'Cancel Selection' : 'Select Multiple'}
                  </button>
                  {currentView === 'active' && (
                    <>
                      <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm">
                        Import CSV <input type="file" className="hidden" accept=".xlsx, .csv" onChange={handleImport} />
                      </label>
                      <button onClick={handleExport} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm">
                        Export Data
                      </button>
                      <button onClick={() => handleOpenModal(null)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm">
                        + Add New Project
                      </button>
                    </>
                  )}
                </div>
              </div>

              {selectedIds.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-5 flex justify-between items-center animate-in slide-in-from-top-2 shadow-sm">
                  <span className="text-blue-800 font-bold text-sm px-2">{selectedIds.length} project{selectedIds.length > 1 ? 's' : ''} selected</span>
                  <div className="flex gap-3">
                    {currentView === 'active' && (<button onClick={() => handleBulkAction('archive')} className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-all shadow-sm">Archive Selected</button>)}
                    {currentView === 'archive' && (
                      <>
                        <button onClick={() => handleBulkAction('restore')} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm">Restore Selected</button>
                        <button onClick={() => handleBulkAction('delete')} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm">Delete Selected</button>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><SearchIcon /></div>
                  <input type="text" placeholder="Search projects or locations..." className="w-full pl-11 pr-5 py-3 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-medium transition-all shadow-sm placeholder:text-slate-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="px-5 py-3 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-semibold text-slate-700 min-w-[180px] transition-all shadow-sm cursor-pointer" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Approved">Approved</option>
                  <option value="Denied">Denied</option>
                  <option value="Endorsed to HREDRB">Endorsed to HREDRB</option>
                </select>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {isBulkMode && (<th className="px-6 py-4 w-[5%]"><input type="checkbox" className="w-4.5 h-4.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" checked={filteredApps.length > 0 && selectedIds.length === filteredApps.length} onChange={handleSelectAll} /></th>)}
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[30%]">Project Details</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">Location</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Certificates</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isLoading ? (
                      <tr><td colSpan={isBulkMode ? 6 : 5} className="px-6 py-20 text-center"><div className="flex flex-col items-center justify-center space-y-4"><div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div><p className="text-slate-500 text-sm font-semibold animate-pulse">Fetching records...</p></div></td></tr>
                    ) : filteredApps.length === 0 ? (
                      <tr><td colSpan={isBulkMode ? 6 : 5} className="px-6 py-12 text-center text-slate-500 text-sm font-medium">No matching records found.</td></tr>
                    ) : (
                      filteredApps.map((app) => (
                        <tr key={app.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(app.id) ? 'bg-blue-50/50' : ''}`}>
                          {isBulkMode && (<td className="px-6 py-5"><input type="checkbox" className="w-4.5 h-4.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" checked={selectedIds.includes(app.id)} onChange={() => handleSelectRow(app.id)} /></td>)}
                          <td className="px-6 py-5">
                            {/* UPDATED: Clickable Project Name */}
                            <div 
                              className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer hover:underline text-base transition-colors"
                              onClick={() => setViewingApp(app)}
                              title="Click to view details"
                            >
                              {app.name_of_proj}
                            </div>
                            <div className="text-sm font-medium text-slate-500 mt-0.5">{app.proj_type} • {app.type_of_application}</div>
                            {app.crls_options && app.crls_options.length > 0 && (<div className="text-xs font-semibold text-blue-600 mt-1.5 bg-blue-50 inline-block px-2 py-0.5 rounded-md">{app.crls_options.join(', ')}</div>)}
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-sm font-bold text-slate-700">{app.mun_city}</div>
                            <div className="text-sm font-medium text-slate-500">{app.prov}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                              <span className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${app.status_of_application === 'Archived' ? 'bg-slate-400' : app.status_of_application === 'Approved' ? 'bg-emerald-500' : app.status_of_application === 'Denied' ? 'bg-red-500' : app.status_of_application === 'Endorsed to HREDRB' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                              <span className="text-sm font-bold text-slate-700">{app.status_of_application}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-slate-600 text-sm font-mono font-medium">CR: {app.cr_no || '-'}<br/>LS: {app.ls_no || '-'}</td>
                          <td className="px-6 py-5 text-right space-x-2">
                            {currentView === 'active' ? (
                              <>
                                {/* UPDATED: View Icon Button */}
                                <button title="View Details" onClick={() => setViewingApp(app)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all inline-flex"><ViewIcon /></button>
                                <button title="Edit Project" onClick={() => handleOpenModal(app)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all inline-flex"><EditIcon /></button>
                                <button title="Archive Project" onClick={() => handleSoftDelete(app.id)} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all inline-flex"><ArchiveIcon /></button>
                              </>
                            ) : (
                              <>
                                <button title="View Details" onClick={() => setViewingApp(app)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all inline-flex"><ViewIcon /></button>
                                <button title="Restore Project" onClick={() => handleRestore(app.id)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all inline-flex"><RestoreIcon /></button>
                                <button title="Delete Forever" onClick={() => handleHardDelete(app.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all inline-flex"><TrashIcon /></button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- FORM ENTRY MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="px-7 py-5 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Project' : 'Add New Project'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="overflow-y-auto p-7 bg-slate-50/50">
              <form id="app-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* TOP SECTION */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Project Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Project Name *</label>
                      <input required type="text" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm" value={formData.name_of_proj} onChange={e => setFormData({...formData, name_of_proj: e.target.value})} />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Owner / Developer</label>
                      <input type="text" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm" value={formData.proj_owner_dev} onChange={e => setFormData({...formData, proj_owner_dev: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Project Type</label>
                      <select className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer" value={formData.proj_type} onChange={e => setFormData({...formData, proj_type: e.target.value})}>
                        <option value="" disabled>Select Type...</option>
                        {projTypeOptionsList.map((type) => (<option key={type} value={type}>{type}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Application Type</label>
                      <select className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer" value={formData.type_of_application} onChange={e => setFormData({...formData, type_of_application: e.target.value})}>
                        <option value="New Application">New Application</option><option value="Reactivated">Reactivated</option><option value="Replacement">Replacement</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Current Status</label>
                      <select className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer" value={formData.status_of_application} onChange={e => setFormData({...formData, status_of_application: e.target.value})}>
                        <option value="Ongoing">Ongoing</option><option value="Approved">Approved</option><option value="Denied">Denied</option><option value="Endorsed to HREDRB">Endorsed to HREDRB</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Main or Compliance</label>
                      <select className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer" value={formData.main_or_compliance} onChange={e => setFormData({...formData, main_or_compliance: e.target.value})}>
                        <option value="Main">Main</option><option value="Compliance">Compliance</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* MID SECTION */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                    Certifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {crlsOptionsList.map((option) => (
                      <label key={option} className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all">
                        <input type="checkbox" className="w-4.5 h-4.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" value={option} checked={formData.crls_options?.includes(option) || false}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setFormData(prev => ({
                              ...prev, crls_options: isChecked ? [...(prev.crls_options || []), option] : (prev.crls_options || []).filter(item => item !== option)
                            }));
                          }}
                        />
                        <span className="text-slate-700 font-medium text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">CR No.</label>
                      <input type="text" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm" placeholder="e.g. 12345" value={formData.cr_no} onChange={(e) => handleNumericDashInput(e, 'cr_no')} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">LS No.</label>
                      <input type="text" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm" placeholder="e.g. 67890" value={formData.ls_no} onChange={(e) => handleNumericDashInput(e, 'ls_no')} />
                    </div>
                  </div>
                </div>

                {/* --- LOCATION SECTION --- */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Location Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    <div className="flex flex-col relative">
                      <div className="h-5 mb-2 flex items-center">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Province</label>
                      </div>
                      <select required className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer" 
                        value={formData.prov} onChange={e => setFormData({...formData, prov: e.target.value, mun_city: '', street_brgy: ''})}
                      >
                        <option value="" disabled>Select Province...</option>
                        {availableProvinces.map(prov => (<option key={prov} value={prov}>{prov}</option>))}
                      </select>
                    </div>

                    <div className="flex flex-col relative">
                      <div className="h-5 mb-2 flex items-center">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Municipality / City</label>
                        <div className="absolute right-0 top-0 flex gap-1 h-5 items-center">
                          {formData.prov && (
                            <button type="button" onClick={handleAddCity} className="whitespace-nowrap text-[10px] text-blue-600 hover:underline font-bold bg-blue-50 px-1.5 py-0.5 rounded">+ Add</button>
                          )}
                          {formData.mun_city && (
                            <button type="button" onClick={handleDeleteCity} className="whitespace-nowrap text-[10px] text-red-500 hover:underline font-bold bg-red-50 px-1.5 py-0.5 rounded">− Del</button>
                          )}
                        </div>
                      </div>
                      <select required disabled={!formData.prov} className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer disabled:bg-slate-50 disabled:text-slate-400" 
                        value={formData.mun_city} onChange={e => setFormData({...formData, mun_city: e.target.value, street_brgy: ''})}
                      >
                        <option value="" disabled>Select City/Mun...</option>
                        {availableCities.map(city => (<option key={city} value={city}>{city}</option>))}
                      </select>
                    </div>

                    <div className="flex flex-col relative">
                      <div className="h-5 mb-2 flex items-center">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Barangay</label>
                        <div className="absolute right-0 top-0 flex gap-1 h-5 items-center">
                          {formData.mun_city && (
                            <button type="button" onClick={handleAddBrgy} className="whitespace-nowrap text-[10px] text-blue-600 hover:underline font-bold bg-blue-50 px-1.5 py-0.5 rounded">+ Add</button>
                          )}
                          {formData.street_brgy && (
                            <button type="button" onClick={handleDeleteBrgy} className="whitespace-nowrap text-[10px] text-red-500 hover:underline font-bold bg-red-50 px-1.5 py-0.5 rounded">− Del</button>
                          )}
                        </div>
                      </div>
                      <select required disabled={!formData.mun_city || availableBarangays.length === 0} className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer disabled:bg-slate-50 disabled:text-slate-400" 
                        value={formData.street_brgy} onChange={e => setFormData({...formData, street_brgy: e.target.value})}
                      >
                        <option value="" disabled>Select Barangay...</option>
                        {availableBarangays.map(brgy => (<option key={brgy} value={brgy}>{brgy}</option>))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* DATES SECTION */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Important Dates
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Date Filed</label>
                      <input type="date" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer" value={formData.date_filed || ''} onChange={e => setFormData({...formData, date_filed: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Date Issued</label>
                      <input type="date" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer" value={formData.date_issued || ''} onChange={e => setFormData({...formData, date_issued: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Date Completion</label>
                      <input type="date" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800 font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer" value={formData.date_completion || ''} onChange={e => setFormData({...formData, date_completion: e.target.value})} />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-7 py-5 border-t border-slate-200 bg-white flex justify-end gap-3 rounded-b-2xl">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl font-bold text-sm transition-colors shadow-sm">Cancel</button>
              <button type="submit" form="app-form" className="px-7 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm">
                {editingId ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- NEW: VIEW PROJECT DETAILS MODAL --- */}
      {viewingApp && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-7 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ViewIcon /> Project Details
              </h3>
              <button onClick={() => setViewingApp(null)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="overflow-y-auto p-7 bg-white">
              <div className="space-y-8">
                
                {/* Header Profile */}
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">{viewingApp.name_of_proj}</h2>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 uppercase tracking-wider">{viewingApp.proj_type}</span>
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 uppercase tracking-wider">{viewingApp.type_of_application}</span>
                    <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 uppercase tracking-wider">{viewingApp.main_or_compliance}</span>
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider border ${
                      viewingApp.status_of_application === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      viewingApp.status_of_application === 'Denied' ? 'bg-red-50 text-red-700 border-red-200' :
                      viewingApp.status_of_application === 'Endorsed to HREDRB' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>{viewingApp.status_of_application}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Owner / Developer</p>
                    <p className="text-sm font-bold text-slate-800">{viewingApp.proj_owner_dev || 'Not Specified'}</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Location</p>
                    <p className="text-sm font-bold text-slate-800">
                      {viewingApp.street_brgy ? viewingApp.street_brgy + ', ' : ''}
                      {viewingApp.mun_city}, {viewingApp.prov}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Registrations & Licenses</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Certificate of Registration (CR No.)</p>
                      <p className="text-lg font-black text-slate-700 font-mono tracking-wide">{viewingApp.cr_no || '---'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">License to Sell (LS No.)</p>
                      <p className="text-lg font-black text-slate-700 font-mono tracking-wide">{viewingApp.ls_no || '---'}</p>
                    </div>
                    <div className="col-span-2 mt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Certification Options</p>
                      <div className="flex flex-wrap gap-2">
                        {viewingApp.crls_options && viewingApp.crls_options.length > 0 ? (
                          viewingApp.crls_options.map((opt, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 shadow-sm text-slate-600 text-xs font-bold rounded-lg">{opt}</span>
                          ))
                        ) : (
                          <span className="text-sm font-medium text-slate-400 italic">No specific options checked.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Important Timeline</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date Filed</p>
                      <p className="text-sm font-bold text-slate-800">{viewingApp.date_filed ? new Date(viewingApp.date_filed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) : '---'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date Issued</p>
                      <p className="text-sm font-bold text-slate-800">{viewingApp.date_issued ? new Date(viewingApp.date_issued).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) : '---'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date of Completion</p>
                      <p className="text-sm font-bold text-slate-800">{viewingApp.date_completion ? new Date(viewingApp.date_completion).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) : '---'}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="px-7 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setViewingApp(null)} className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-sm transition-colors shadow-sm">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}