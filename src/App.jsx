import React, { useState, useEffect } from 'react';
import { Ship, Coins, Package, BookOpen, Anchor, Map as MapIcon, Award, Star, Info, X, CheckCircle, AlertTriangle, Store, MapPin, TrendingUp, TrendingDown, Receipt, Compass, Lock, Medal, Gift } from 'lucide-react';

// --- ฐานข้อมูลประวัติศาสตร์และเกม ---

const ITEMS = {
  rice: { id: 'rice', name: 'ข้าวสาร', type: 'free', icon: '🌾', desc: 'สินค้าส่งออกหลัก ปลูกมากในลุ่มแม่น้ำเจ้าพระยา', wants: ['voc', 'china'], buyPrice: 2, sellPrice: 3 },
  pottery: { id: 'pottery', name: 'เครื่องปั้นดินเผา', type: 'free', icon: '🏺', desc: 'ของใช้ในครัวเรือน ทำจากดินเหนียว', wants: [], buyPrice: 1, sellPrice: 2 },
  wicker: { id: 'wicker', name: 'เครื่องจักสาน', type: 'free', icon: '🧺', desc: 'ตะกร้าและกระบุง สานจากไม้ไผ่และหวาย', wants: [], buyPrice: 1, sellPrice: 2 },
  fabric: { id: 'fabric', name: 'ผ้าทอพื้นเมือง', type: 'free', icon: '🧵', desc: 'ผ้าทอมือจากชาวบ้านในหัวเมืองต่างๆ', wants: ['india', 'persia'], buyPrice: 3, sellPrice: 5 },
  dried_food: { id: 'dried_food', name: 'อาหารแห้ง', type: 'free', icon: '🥩', desc: 'เสบียงสำหรับการเดินทางรอนแรม', wants: ['portugal'], buyPrice: 1, sellPrice: 2 },
  salt: { id: 'salt', name: 'เกลือ', type: 'free', icon: '🧂', desc: 'ของจำเป็นสำหรับถนอมอาหาร มาจากหัวเมืองชายทะเล', wants: [], buyPrice: 2, sellPrice: 3 },
  sugar: { id: 'sugar', name: 'น้ำตาล', type: 'free', icon: '🍯', desc: 'น้ำตาลโตนดและน้ำตาลทราย หวานหอม', wants: ['japan', 'persia'], buyPrice: 2, sellPrice: 4 },
  dried_fish: { id: 'dried_fish', name: 'ปลาแห้ง', type: 'free', icon: '🐟', desc: 'ปลาจากแม่น้ำและทะเล นำมาตากแห้ง', wants: [], buyPrice: 1, sellPrice: 2 },
  fruit: { id: 'fruit', name: 'ผลไม้เมืองร้อน', type: 'free', icon: '🍌', desc: 'กล้วย มะม่วง จากสวนชาวบ้าน', wants: [], buyPrice: 1, sellPrice: 2 },
  coconut_oil: { id: 'coconut_oil', name: 'น้ำมันมะพร้าว', type: 'free', icon: '🥥', desc: 'ใช้ทำอาหารและจุดตะเกียง', wants: ['portugal', 'voc'], buyPrice: 2, sellPrice: 3 },
  
  wood: { id: 'wood', name: 'ไม้หอม/กฤษณา', type: 'monopoly', icon: '🪵', desc: 'ของป่าหายาก มีกลิ่นหอม', wants: ['china', 'japan', 'india', 'persia'], buyPrice: 4, sellPrice: 7 },
  ivory: { id: 'ivory', name: 'งาช้าง', type: 'monopoly', icon: '🐘', desc: 'ของมีค่าจากป่าลึก นิยมนำไปทำเครื่องประดับ', wants: ['china', 'japan'], buyPrice: 5, sellPrice: 8 },
  skin: { id: 'skin', name: 'หนังสัตว์', type: 'monopoly', icon: '🦌', desc: 'หนังกวางและสัตว์ป่า', wants: ['japan', 'voc'], buyPrice: 3, sellPrice: 5 },
  tin: { id: 'tin', name: 'ดีบุก', type: 'monopoly', icon: '🪨', desc: 'แร่ธาตุสำคัญจากหัวเมืองปักษ์ใต้', wants: ['voc', 'india'], buyPrice: 3, sellPrice: 6 },
  minerals: { id: 'minerals', name: 'แร่หายาก', type: 'monopoly', icon: '💎', desc: 'ทรัพยากรมีค่าใต้ดิน', wants: [], buyPrice: 4, sellPrice: 6 },
  weapons: { id: 'weapons', name: 'อุปกรณ์โลหะ', type: 'monopoly', icon: '🛡️', desc: 'สินค้านำเข้าที่รัฐต้องดูแลอย่างใกล้ชิด', importsFrom: ['portugal', 'japan'], buyPrice: 6, sellPrice: 9 },
  gunpowder: { id: 'gunpowder', name: 'ดินประสิว', type: 'monopoly', icon: '🎇', desc: 'ของสำคัญ กรมท่าและพระคลังสินค้าควบคุมดูแล', importsFrom: ['portugal'], buyPrice: 5, sellPrice: 8 },

  silk: { id: 'silk', name: 'ผ้าไหม', type: 'import', icon: '👘', desc: 'ผ้าราคาแพง นำเข้าจากจีน', importsFrom: ['china'], buyPrice: 5, sellPrice: 7 },
  spice: { id: 'spice', name: 'เครื่องเทศ', type: 'import', icon: '🌶️', desc: 'ของหรูหรา ถนอมอาหาร นำเข้าจากอินเดียและชวา', importsFrom: ['india', 'voc', 'persia'], buyPrice: 4, sellPrice: 6 },
  horse: { id: 'horse', name: 'ม้าเทศ', type: 'import', icon: '🐎', desc: 'ม้าพันธุ์ดีสำหรับเจ้านาย', importsFrom: ['persia'], buyPrice: 8, sellPrice: 10 },
};

const COUNTRIES = [
  { id: 'china', name: 'พ่อค้าจีน', emoji: '👲', bg: 'bg-[#FFDAB9]', text: 'text-[#8B4513]', wants: ['wood', 'ivory', 'rice'], brings: ['silk'], greeting: 'หนีห่าว! ข้าต้องการของป่ากลับเมืองจีน' },
  { id: 'japan', name: 'ซามูไรญี่ปุ่น', emoji: '🧑‍🎤', bg: 'bg-[#E6E6FA]', text: 'text-[#483D8B]', wants: ['skin', 'ivory', 'wood', 'sugar'], brings: ['weapons'], greeting: 'โคนิจิวะ ข้ามาหาทรัพยากรกลับบ้านเกิด' },
  { id: 'india', name: 'พ่อค้าอินเดีย', emoji: '👳‍♂️', bg: 'bg-[#FFE4B5]', text: 'text-[#D2691E]', wants: ['tin', 'wood', 'fabric'], brings: ['spice'], greeting: 'นมัสเต ข้านำเครื่องเทศมาขาย และอยากได้ดีบุก' },
  { id: 'persia', name: 'พ่อค้าเปอร์เซีย', emoji: '🧞‍♂️', bg: 'bg-[#E0FFFF]', text: 'text-[#008B8B]', wants: ['fabric', 'wood', 'sugar'], brings: ['horse', 'spice'], greeting: 'ข้านำม้าอาหรับชั้นดีมาเยือนกรุงศรีฯ' },
  { id: 'portugal', name: 'ทหารโปรตุเกส', emoji: '💂‍♂️', bg: 'bg-[#F0FFF0]', text: 'text-[#2E8B57]', wants: ['dried_food'], brings: ['weapons', 'gunpowder'], greeting: 'ข้าคือชาวตะวันตก นำวิทยาการมานำเสนอ' },
  { id: 'voc', name: 'พ่อค้าฮอลันดา', emoji: '👨‍✈️', bg: 'bg-[#F0F8FF]', text: 'text-[#4682B4]', wants: ['spice', 'skin', 'tin', 'rice'], brings: ['weapons', 'spice'], greeting: 'บริษัท VOC ของเราสนใจดีบุกและสินค้าของท่าน' }
];

const EVENTS = [
  { id: 'normal', name: 'บรรยากาศการค้าปกติ', target: null, effect: 0, desc: 'ราคาสินค้าทุกอย่างทรงตัว อากาศแจ่มใส' },
  { id: 'rice_boom', name: 'ผลผลิตข้าวอุดมสมบูรณ์', target: 'rice', effect: -1, desc: 'ข้าวราคาถูกลง 1 พดด้วง' },
  { id: 'spice_craze', name: 'ความต้องการเครื่องเทศสูง', target: 'spice', effect: 1, desc: 'เครื่องเทศราคาแพงขึ้น 1 พดด้วง' },
  { id: 'wood_shortage', name: 'ไม้หอมหายาก', target: 'wood', effect: 1, desc: 'ไม้หอมราคาแพงขึ้น 1 พดด้วง' },
  { id: 'salt_need', name: 'ฤดูถนอมอาหาร', target: 'salt', effect: 1, desc: 'เกลือราคาแพงขึ้น 1 พดด้วง' },
  { id: 'fabric_cheap', name: 'ชาวบ้านทอผ้าได้มาก', target: 'fabric', effect: -1, desc: 'ผ้าทอราคาถูกลง 1 พดด้วง' }
];

const INITIAL_INVENTORY = {
  rice: 5, pottery: 3, wicker: 2, salt: 3, dried_fish: 2,
  fabric: 0, dried_food: 0, sugar: 0, fruit: 0, coconut_oil: 0,
  wood: 1, ivory: 0, skin: 1, tin: 1
};

export default function App() {
  const [gameState, setGameState] = useState('home');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(20); 
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [currentEvent, setCurrentEvent] = useState(EVENTS[0]);
  
  const [exploredZones, setExploredZones] = useState([]);
  const [badges, setBadges] = useState([]);
  const [activeBuff, setActiveBuff] = useState(null); 
  
  const [queue, setQueue] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  
  const [showInventory, setShowInventory] = useState(false);
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [showExploreMap, setShowExploreMap] = useState(false);
  const [canExplore, setCanExplore] = useState(true);
  const [popupMessage, setPopupMessage] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getCalculatedPrices = (item, country = null, isBuyingFromNPC = false) => {
    let buyPrice = item.buyPrice;
    let sellPrice = item.sellPrice;
    let eventEffect = 0;
    let countryBonus = 0;
    let activeBuffEffect = 0;

    if (currentEvent.target === item.id) {
      eventEffect = currentEvent.effect;
      buyPrice += eventEffect;
      sellPrice += eventEffect;
    }

    if (activeBuff && activeBuff.target === item.id) {
      if (activeBuff.type === 'buy') {
        buyPrice += activeBuff.effect;
        activeBuffEffect = activeBuff.effect;
      }
      if (activeBuff.type === 'sell' && !isBuyingFromNPC) {
        sellPrice += activeBuff.effect;
        activeBuffEffect = activeBuff.effect;
      }
    }

    if (!isBuyingFromNPC && country && country.wants.includes(item.id)) {
      countryBonus = 1; 
    }

    buyPrice = Math.max(1, buyPrice);
    sellPrice = Math.max(2, sellPrice);
    
     return {
  cost: item.buyPrice,
  currentBuyPrice: buyPrice,
  baseSellPrice: item.sellPrice,
  currentSellPrice: sellPrice + countryBonus,
  eventEffect,
  countryBonus,
  activeBuffEffect
};

  const startLevel = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      setActiveBuff(null); 
      const randEvent = Math.random() < 0.4 ? EVENTS[Math.floor(Math.random() * (EVENTS.length - 1)) + 1] : EVENTS[0];
      setCurrentEvent(randEvent);
      setIsTransitioning(false);
  }, 500);
};

  const startTrading = () => {
      const numCustomers = Math.floor(Math.random() * 3) + 3;
      const newQueue = [];
      for (let i = 0; i < numCustomers; i++) {
        const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
        const willBuyFromUs = Math.random() > 0.4;
        
        let itemKey;
        if (willBuyFromUs && country.wants.length > 0) {
           itemKey = country.wants[Math.floor(Math.random() * country.wants.length)];
        } else {
           itemKey = country.brings[Math.floor(Math.random() * country.brings.length)];
           if(!itemKey) itemKey = 'rice';
        }

        newQueue.push({ country, item: ITEMS[itemKey], isBuying: !willBuyFromUs });
      }
      
      setQueue(newQueue);
      setCurrentCustomer(newQueue[0]);
      setGameState('playing');
      setPopupMessage(null);
      setIsTransitioning(false);
    }, 1500); // Transition duration
  };

  const nextCustomer = () => {
    const nextQueue = queue.slice(1);
    setQueue(nextQueue);
    if (nextQueue.length > 0) {
      setCurrentCustomer(nextQueue[0]);
      setPopupMessage(null);
    } else {
      const possibleRewards = ['rice', 'wood', 'pottery', 'dried_fish', 'skin', 'spice'];
      const rewardItemKey = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];
      const rewardAmount = Math.floor(Math.random() * 3) + 1;
      const rewardItem = ITEMS[rewardItemKey];

      setPopupMessage({
        title: 'ตะวันตกดิน จบวันค้าขาย!',
        desc: `ผลประกอบการดีเยี่ยมในระดับ ${level}\n🎁 ของกำนัล: ${rewardItem.name} x${rewardAmount}`,
        type: 'success',
        action: () => {
          setInventory(prev => ({ ...prev, [rewardItemKey]: (prev[rewardItemKey] || 0) + rewardAmount }));
          setLevel(l => l + 1);
          setCanExplore(true);
          setGameState('home');
          setPopupMessage(null);
        }
      });
    }
  };

  const handleSellFree = (item) => {
    if ((inventory[item.id] || 0) > 0) {
      const prices = getCalculatedPrices(item, currentCustomer.country, false);
      const profit = prices.currentSellPrice - prices.cost; 
      setInventory(prev => ({ ...prev, [item.id]: prev[item.id] - 1 }));
      setScore(s => s + prices.currentSellPrice);
      showResultPopup(`ขาย ${item.name} สำเร็จ!`, `รับเงิน ${prices.currentSellPrice} พดด้วง (กำไรสุทธิ +${profit})`, 'success', nextCustomer);
    } else {
      showResultPopup('สินค้าหมด!', `คุณไม่มี ${item.name} ในคลังเลย`, 'error');
    }
  };

  const handleAskPermission = (item) => {
    if ((inventory[item.id] || 0) <= 0) {
      showResultPopup('สินค้าหมด!', `คุณไม่มี ${item.name} ในคลัง`, 'error');
      return;
    }
    const prices = getCalculatedPrices(item, currentCustomer.country, false);
    const rand = Math.random();

    if (rand < 0.6) {
      const fee = 1;
      const finalRevenue = prices.currentSellPrice - fee;
      const profit = finalRevenue - prices.cost;
      setInventory(prev => ({ ...prev, [item.id]: prev[item.id] - 1 }));
      setScore(s => s + finalRevenue);
      showResultPopup('พระคลังสินค้าอนุญาต!', `ขายได้ ${prices.currentSellPrice} หักค่าธรรมเนียมหลวง ${fee} พดด้วง\nรับเงินสุทธิ ${finalRevenue} พดด้วง (กำไร +${profit})`, 'success', nextCustomer);
    } else if (rand < 0.8) {
      showResultPopup('รอพิจารณาเอกสาร', `ขุนนางให้รอเอกสาร ลูกค้าคนนี้ขอตัวกลับก่อน\n(ไม่เสียสินค้าและเงิน)`, 'warning', nextCustomer);
    } else {
      showResultPopup('ไม่อนุญาต!', `สินค้าชิ้นนี้รัฐต้องการเก็บไว้ใช้เอง ห้ามขาย!\n(ไม่เสียสินค้าและเงิน)`, 'error', nextCustomer);
    }
  };

  const handleBuy = (item) => {
    const prices = getCalculatedPrices(item, null, true);
    if (score >= prices.currentBuyPrice) {
      setScore(s => s - prices.currentBuyPrice);
      setInventory(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
      showResultPopup(`ซื้อ ${item.name} สำเร็จ!`, `ลูกหาบขนเข้าคลังแล้ว จ่ายเงิน ${prices.currentBuyPrice} พดด้วง`, 'success', nextCustomer);
    } else {
      showResultPopup('เงินไม่พอ!', `ต้องใช้ ${prices.currentBuyPrice} พดด้วง แต่ท่านมี ${score} พดด้วง`, 'error');
    }
  };

  const handleRefuse = () => showResultPopup('กล่าวคำปฏิเสธ', 'ท่านยิ้มแย้มและปล่อยลูกค้าคนนี้ผ่านไป', 'warning', nextCustomer);

  const handleBailout = () => {
    setScore(10);
    showResultPopup('สหายการค้าช่วยเหลือ!', 'กลุ่มพ่อค้าใจดีมอบเงินทุนกู้ยืมให้ท่าน 10 พดด้วง เพื่อตั้งตัวใหม่', 'success');
  };

  const showResultPopup = (title, desc, type, action = null) => {
    setPopupMessage({ 
      title, desc, type, 
      action: () => {
        setPopupMessage(null); 
        if (action) action();  
      } 
    });
  };

  const checkAndAwardExplorerBadge = (newExploredZones) => {
    if (newExploredZones.length === 5 && !badges.includes('explorer')) {
      setBadges([...badges, 'explorer']);
      setScore(s => s + 10); 
      setTimeout(() => {
        showResultPopup(
          '🎉 ได้รับเข็มกลัดนักสำรวจ!', 
          'ท่านได้รับเข็มกลัด "นักสำรวจหัวเมือง" และหีบทองคำ!\n(โบนัส +10 พดด้วง)\nท่านคือผู้เชี่ยวชาญเส้นทางการค้าแห่งอยุธยา!', 
          'success'
        );
      }, 500);
    }
  };

  // --- UI Components ---
  const renderProgressBar = () => {
    const maxLevel = 10;
    const progress = Math.min((level / maxLevel) * 100, 100);
    return (
      <div className="w-full max-w-md mx-auto mb-6 relative">
        <div className="flex justify-between text-[#8B5A2B] text-sm font-bold mb-1 px-2">
          <span>อยุธยา</span>
          <span>มุ่งสู่โลกกว้าง</span>
        </div>
        {/* ลำน้ำ */}
        <div className="h-6 bg-[#E0F7FA] rounded-full relative overflow-hidden border-4 border-[#8B5A2B] shadow-inner">
          <div className="h-full bg-gradient-to-r from-[#81D4FA] to-[#4FC3F7] absolute left-0 top-0 transition-all duration-1000 ease-in-out" style={{ width: `${progress}%` }}></div>
          {/* เงาสะท้อนน้ำ */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] opacity-30"></div>
          {/* เรือแล่น */}
          <Ship className="absolute top-[-2px] text-[#A0522D] drop-shadow-md transition-all duration-1000 z-10 animate-idle" size={24} style={{ left: `calc(${progress}% - 12px)` }} />
        </div>
      </div>
    );
  };

  const TopNav = () => (
    <div className="flex justify-between items-center bg-[#8B5A2B] text-[#FFF8DC] p-3 shadow-lg rounded-b-2xl mb-4 z-20 relative border-b-4 border-[#5C3A21]">
      <div className="flex items-center gap-2">
        <div className="bg-[#FFF8DC] text-[#8B5A2B] px-4 py-1.5 rounded-full font-bold flex items-center gap-2 shadow-inner border-2 border-[#D2B48C]">
          <div className="bg-gray-300 rounded-full p-0.5 border border-gray-400 shadow-sm"><Coins size={14} className="text-gray-600" /></div>
          <span>{score} พดด้วง</span>
        </div>
        <div className="bg-[#DEB887] text-[#5C3A21] px-4 py-1.5 rounded-full font-bold shadow-inner border-2 border-[#CD853F] hidden md:block">
          ด่านที่ {level}
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setShowKnowledge(true)} className="px-3 py-1.5 bg-[#CD853F] hover:bg-[#D2691E] rounded-full transition flex items-center gap-2 shadow-md border-2 border-[#A0522D]">
          <BookOpen size={16} className="text-[#FFF8DC]" /> <span className="text-sm font-bold text-[#FFF8DC] hidden md:inline">สมุดบันทึก</span>
        </button>
        <button onClick={() => setShowInventory(true)} className="px-3 py-1.5 bg-[#CD853F] hover:bg-[#D2691E] rounded-full transition flex items-center gap-2 shadow-md border-2 border-[#A0522D]">
          <Package size={16} className="text-[#FFF8DC]"/> <span className="text-sm font-bold text-[#FFF8DC] hidden md:inline">คลังสินค้า</span>
        </button>
      </div>
    </div>
  );

  // --- Views ---
  if (gameState === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#A4D8E1] via-[#E0F7FA] to-[#FFFACD] font-sans overflow-hidden flex flex-col relative">
        <GlobalStyles />
        
        {/* Background Scenery */}
        <div className="absolute inset-0 pointer-events-none z-0">
           {/* Sun */}
           <div className="absolute top-10 right-10 w-32 h-32 bg-[#FFF9C4] rounded-full blur-2xl animate-pulse"></div>
           <div className="absolute top-16 right-16 w-20 h-20 bg-[#FFF59D] rounded-full blur-lg"></div>
           {/* Clouds */}
           <div className="absolute top-20 left-10 text-6xl opacity-80 animate-float" style={{ animationDuration: '8s' }}>☁️</div>
           <div className="absolute top-10 left-1/3 text-4xl opacity-60 animate-float" style={{ animationDuration: '10s' }}>☁️</div>
           <div className="absolute top-32 right-1/4 text-5xl opacity-70 animate-float" style={{ animationDuration: '9s' }}>☁️</div>
           {/* City silhouettes */}
           <div className="absolute bottom-[20%] left-0 w-full flex justify-around opacity-40 items-end">
              <div className="w-16 h-24 bg-[#A0522D] rounded-t-lg"></div>
              <div className="w-32 h-16 bg-[#8B5A2B] rounded-t-xl"></div>
              <div className="text-6xl mb-4">🌴</div>
              <div className="w-24 h-32 bg-[#A0522D] rounded-t-full"></div>
              <div className="text-5xl mb-2">🌴</div>
              <div className="w-40 h-20 bg-[#8B5A2B] rounded-t-md"></div>
           </div>
           {/* River */}
           <div className="absolute bottom-0 w-full h-[25%] bg-gradient-to-b from-[#81D4FA] to-[#29B6F6] border-t-4 border-[#4FC3F7]">
             <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           </div>
        </div>

        <TopNav />
        
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center z-10">
          
          <div className="relative mb-2">
            <h1 className="text-4xl md:text-5xl font-black text-[#5C3A21] drop-shadow-md mb-1 relative z-10 tracking-wide" style={{ textShadow: '2px 2px 0px #FFF8DC, -1px -1px 0px #FFF8DC' }}>
              Ayutthaya
            </h1>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#D97706] drop-shadow-md tracking-wider" style={{ textShadow: '2px 2px 0px #FFF8DC' }}>
              Trade Adventure
            </h2>
            <p className="text-[#8B5A2B] font-bold text-lg mt-2 bg-[#FFF8DC]/80 px-4 py-1 rounded-full inline-block shadow-sm">พ่อค้าแห่งสยาม</p>
          </div>

          <div className="text-8xl mb-2 animate-float drop-shadow-2xl">⛵</div>

          {badges.length > 0 && (
            <div className="flex gap-2 mb-2">
              {badges.includes('explorer') && (
                <div className="bg-[#FFF8DC] border-2 border-[#F59E0B] px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-[#B45309] shadow-md animate-bounce" style={{ animationIterationCount: 3 }}>
                  <Medal size={16} className="text-[#F59E0B]"/> นักสำรวจหัวเมือง
                </div>
              )}
            </div>
          )}

          {renderProgressBar()}

          <div className="bg-[#FFF8DC]/95 p-6 rounded-3xl shadow-xl border-4 border-[#DEB887] max-w-sm w-full backdrop-blur-sm relative overflow-hidden">
            {/* Wood texture accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[#8B5A2B] opacity-50"></div>
            
            <div className={`mb-5 p-3 rounded-2xl border-2 ${currentEvent.id === 'normal' ? 'bg-[#F3F4F6] border-[#D1D5DB]' : currentEvent.effect > 0 ? 'bg-[#FFEDD5] border-[#FDBA74]' : 'bg-[#D1FAE5] border-[#6EE7B7]'}`}>
              <div className="text-sm font-bold text-gray-700 mb-1 flex items-center justify-center gap-1">
                <TrendingUp size={16} /> ข่าวลือในพระนคร
              </div>
              <div className="font-bold text-[#8B5A2B]">{currentEvent.name}</div>
              <div className="text-xs text-[#A0522D]">{currentEvent.desc}</div>
            </div>

            <button 
              onClick={startLevel}
              className="w-full py-4 bg-gradient-to-b from-[#FDE047] to-[#F59E0B] hover:from-[#FEF08A] hover:to-[#F59E0B] text-[#78350F] text-xl font-black rounded-2xl shadow-lg border-b-4 border-[#B45309] transition transform hover:scale-105 active:translate-y-1 flex justify-center items-center gap-2 mb-4"
            >
              <Anchor size={24} /> เปิดร้านค้า วันที่ {level}
            </button>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => setShowMarket(true)}
                className="py-3 bg-gradient-to-b from-[#60A5FA] to-[#3B82F6] text-white font-bold rounded-2xl shadow-md border-b-4 border-[#2563EB] hover:brightness-110 transition flex flex-col items-center justify-center gap-1"
              >
                <Store size={22} /> ตลาดในเมือง
              </button>
              <button 
                onClick={() => {
                  if (canExplore) setShowExploreMap(true);
                  else showResultPopup('สหายเอ๋ย!', 'ท่านออกเดินทางไปแล้วในวันนี้ โปรดรอวันพรุ่งนี้นะ', 'warning');
                }}
                className={`py-3 ${canExplore ? 'bg-gradient-to-b from-[#34D399] to-[#10B981] border-[#059669]' : 'bg-gray-400 border-gray-500 cursor-not-allowed'} text-white font-bold rounded-2xl shadow-md border-b-4 hover:brightness-110 transition flex flex-col items-center justify-center gap-1`}
              >
                <Compass size={22} /> แผนที่สำรวจ
              </button>
            </div>
            
            {score <= 0 && (
              <button onClick={handleBailout} className="w-full py-2 bg-red-50 hover:bg-red-100 text-[#B91C1C] border-2 border-[#FCA5A5] font-bold rounded-xl shadow-sm transition mb-4 animate-pulse">
                ขอความช่วยเหลือจากเพื่อน!
              </button>
            )}

            <div className="flex justify-center gap-2 text-[#8B5A2B] font-bold bg-[#FDE68A] py-2 rounded-xl border border-[#FCD34D]">
               <Award size={20} className="text-[#D97706]" /> ตำแหน่ง: {score > 50 ? 'เจ้าสัวผู้มั่งคั่ง' : score > 30 ? 'นายอากรผู้ปราดเปรื่อง' : 'พ่อค้าหน้าใหม่'}
            </div>
          </div>
        </div>

        {/* Transition Ship Overlay */}
        {isTransitioning && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#81D4FA] transition-opacity duration-500">
             <div className="text-9xl animate-sail-across drop-shadow-2xl">⛵</div>
           </div>
        )}

        {/* Modals & Popups */}
        {popupMessage && <PopupMessage message={popupMessage} />}
        {showInventory && <InventoryModal inventory={inventory} onClose={() => setShowInventory(false)} />}
        {showKnowledge && <KnowledgeModal onClose={() => setShowKnowledge(false)} />}
        {showMarket && <MarketModal inventory={inventory} setInventory={setInventory} score={score} setScore={setScore} onClose={() => setShowMarket(false)} currentEvent={currentEvent} />}
        {showExploreMap && <ExploreMapModal level={level} canExplore={canExplore} setCanExplore={setCanExplore} setInventory={setInventory} setScore={setScore} setActiveBuff={setActiveBuff} exploredZones={exploredZones} setExploredZones={setExploredZones} checkAndAwardExplorerBadge={checkAndAwardExplorerBadge} showResultPopup={showResultPopup} onClose={() => setShowExploreMap(false)} />}
      </div>
    );
  }

  if (gameState === 'playing' && currentCustomer) {
    const { country, item, isBuying } = currentCustomer;
    const prices = getCalculatedPrices(item, country, isBuying);
    
    return (
      <div className="min-h-screen bg-[#F5DEB3] font-sans flex flex-col relative overflow-hidden">
        <GlobalStyles />
        
        {/* Background Wood & Awning */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Wood Planks */}
          <div className="absolute inset-0 bg-[#DEB887] opacity-60" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(139, 69, 19, 0.1) 40px, rgba(139, 69, 19, 0.1) 42px)' }}></div>
          {/* Top Awning */}
          <div className="absolute top-0 w-full h-16 shadow-lg z-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #FDE047, #FDE047 30px, #FEF08A 30px, #FEF08A 60px)', borderBottom: '6px solid #D97706', borderRadius: '0 0 20px 20px' }}></div>
          {/* Distant Ships */}
          <div className="absolute top-32 right-10 text-4xl opacity-40 animate-idle">⛵</div>
          <div className="absolute top-40 left-10 text-5xl opacity-30 animate-idle" style={{animationDelay: '1s'}}>🚢</div>
        </div>

        <TopNav />

        <div className="flex-1 p-4 max-w-3xl mx-auto w-full flex flex-col z-10 mt-6">
          <div className="flex justify-between items-center text-[#5C3A21] font-bold mb-4 bg-[#FFF8DC]/90 p-3 rounded-2xl border-4 border-[#DEB887] shadow-sm text-sm">
             <span className="bg-[#DEB887] px-3 py-1 rounded-full text-white">ลูกค้าคิวที่: {queue.length}</span>
             <div className="flex flex-col items-end">
                <span className="flex items-center gap-1 text-xs text-[#D97706]"><TrendingUp size={14} /> {currentEvent.name}</span>
                {activeBuff && <span className="flex items-center gap-1 text-[10px] text-[#2563EB] font-bold mt-1 bg-blue-100 px-2 py-0.5 rounded-full">✨ บัฟสำรวจ</span>}
             </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-center justify-center relative gap-6">
            
            {/* Left: Character & Speech */}
            <div className="flex flex-col items-center flex-1 w-full">
               <div className="bg-[#FFFBF0] p-5 rounded-3xl shadow-lg border-4 border-[#D97706] relative w-full mb-6 text-center">
                 <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[15px] border-t-[#D97706]"></div>
                 <div className="absolute -bottom-[11px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[11px] border-t-[#FFFBF0]"></div>
                 
                 <p className="text-lg md:text-xl text-[#8B5A2B] font-bold mb-2 leading-tight">"{country.greeting}"</p>
                 <p className="text-sm md:text-md text-[#A0522D] font-medium bg-[#FFEDD5] inline-block px-4 py-1.5 rounded-full border border-[#FDBA74]">
                   ข้ามา {isBuying ? 'เสนอขาย' : 'ขอซื้อ'} <span className="font-black text-lg ml-1">{item.icon} {item.name}</span>
                 </p>
               </div>

               <div className="relative">
                 <div className={`text-8xl md:text-9xl mb-2 animate-idle drop-shadow-2xl ${country.bg} rounded-full p-6 border-8 border-white`}>
                   {country.emoji}
                 </div>
                 {/* Shadow below character */}
                 <div className="w-24 h-4 bg-black/20 rounded-full mx-auto blur-sm mt-2 animate-pulse"></div>
               </div>
               
               <div className={`px-5 py-1.5 rounded-full font-black text-sm mt-4 shadow-md ${country.bg} ${country.text} border-2 border-current opacity-90`}>
                 {country.name}
               </div>
            </div>

            {/* Right: Trading Panel */}
            <div className="w-full md:w-1/2 bg-[#FFF8DC] rounded-[30px] p-6 shadow-2xl border-4 border-[#8B5A2B]">
              <div className="flex justify-between items-start mb-4 bg-white p-3 rounded-2xl border-2 border-[#DEB887]">
                 <div className="flex items-center gap-3">
                    <span className="text-4xl bg-[#FFEDD5] p-2 rounded-xl border border-[#FDBA74] shadow-sm">{item.icon}</span>
                    <div>
                      <h3 className="font-black text-[#5C3A21] text-lg">{item.name}</h3>
                      <span className={`text-[10px] px-2 py-1 rounded-md font-bold text-white shadow-sm mt-1 inline-block ${item.type === 'free' ? 'bg-[#34D399]' : item.type === 'monopoly' ? 'bg-[#F87171]' : 'bg-[#60A5FA]'}`}>
                        {item.type === 'free' ? '✅ สินค้าเสรี' : item.type === 'monopoly' ? '⚠️ สินค้าหลวง' : '🚢 นำเข้า'}
                      </span>
                    </div>
                 </div>
                 <div className="text-center bg-[#F3F4F6] px-3 py-1.5 rounded-xl border border-[#D1D5DB]">
                    <div className="text-[10px] font-bold text-gray-500 uppercase">ในคลัง</div>
                    <div className="text-2xl font-black text-[#8B5A2B] leading-none">{inventory[item.id] || 0}</div>
                 </div>
              </div>

              <div className="bg-[#FFF3E0] p-4 rounded-2xl mb-6 border-2 border-[#FFCC80] text-sm shadow-inner">
                <div className="font-black text-[#E65100] mb-2 flex items-center gap-1 border-b-2 border-[#FFE0B2] pb-1">
                  <Receipt size={16}/> บันทึกบัญชีราคา
                </div>
                
                {isBuying ? (
                  <div className="space-y-1 text-[#5D4037] font-medium">
                    <div className="flex justify-between"><span>ราคาทุนปกติ:</span><span>{prices.cost} พดด้วง</span></div>
                    {prices.eventEffect !== 0 && <div className={`flex justify-between ${prices.eventEffect > 0 ? 'text-[#D32F2F]' : 'text-[#388E3C]'}`}><span>ผลจากข่าวลือ:</span><span>{prices.eventEffect > 0 ? '+' : ''}{prices.eventEffect}</span></div>}
                    {prices.activeBuffEffect !== 0 && <div className={`flex justify-between font-bold ${prices.activeBuffEffect > 0 ? 'text-[#D32F2F]' : 'text-[#1976D2]'}`}><span>บัฟพิเศษ:</span><span>{prices.activeBuffEffect > 0 ? '+' : ''}{prices.activeBuffEffect}</span></div>}
                    <div className="flex justify-between font-black text-lg text-[#E65100] pt-2 border-t border-[#FFE0B2] mt-2">
                      <span>สรุปต้องจ่าย:</span><span>{prices.currentBuyPrice} พดด้วง</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-[#5D4037] font-medium">
                    <div className="flex justify-between"><span>ราคาทุนท่าน:</span><span>{prices.cost} พดด้วง</span></div>
                    <div className="flex justify-between"><span>ราคาขายปกติ:</span><span>{prices.baseSellPrice} พดด้วง</span></div>
                    {prices.countryBonus > 0 && <div className="flex justify-between text-[#1976D2] text-[10px] font-bold"><span>กำไรจากต่างชาติ:</span><span>+1</span></div>}
                    {prices.eventEffect !== 0 && <div className={`flex justify-between text-[10px] font-bold ${prices.eventEffect > 0 ? 'text-[#388E3C]' : 'text-[#D32F2F]'}`}><span>ผลจากข่าวลือ:</span><span>{prices.eventEffect > 0 ? '+' : ''}{prices.eventEffect}</span></div>}
                    {prices.activeBuffEffect !== 0 && <div className="flex justify-between font-bold text-[#1976D2] text-[10px]"><span>บัฟพิเศษ:</span><span>{prices.activeBuffEffect > 0 ? '+' : ''}{prices.activeBuffEffect}</span></div>}
                    {item.type === 'monopoly' && <div className="flex justify-between text-[#D32F2F] text-[10px] font-bold"><span>*ภาษีของหลวง:</span><span>-1</span></div>}
                    <div className="flex justify-between font-black text-lg text-[#388E3C] pt-2 border-t border-[#FFE0B2] mt-2">
                      <span>สรุปรับเงิน:</span><span>{prices.currentSellPrice} พดด้วง</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {isBuying ? (
                  <button onClick={() => handleBuy(item)} className="w-full py-4 bg-gradient-to-b from-[#60A5FA] to-[#3B82F6] hover:brightness-110 text-white rounded-2xl font-black shadow-md border-b-4 border-[#2563EB] transition active:translate-y-1 flex justify-center items-center gap-2">
                    <Coins size={20} /> ซื้อเข้าคลัง (-{prices.currentBuyPrice})
                  </button>
                ) : (
                  item.type === 'free' ? (
                    <button onClick={() => handleSellFree(item)} className="w-full py-4 bg-gradient-to-b from-[#34D399] to-[#10B981] hover:brightness-110 text-white rounded-2xl font-black shadow-md border-b-4 border-[#059669] transition active:translate-y-1">
                      ขายทันที (+{prices.currentSellPrice})
                    </button>
                  ) : (
                    <button onClick={() => handleAskPermission(item)} className="w-full py-3 bg-gradient-to-b from-[#F87171] to-[#EF4444] hover:brightness-110 text-white rounded-2xl font-black shadow-md border-b-4 border-[#B91C1C] transition active:translate-y-1 flex flex-col items-center justify-center leading-tight">
                      <span className="text-lg">ขออนุญาตขาย</span>
                      <span className="text-[10px] font-medium bg-black/20 px-2 rounded-full mt-1">(สุ่มผ่าน: ได้ +{prices.currentSellPrice} หัก -1)</span>
                    </button>
                  )
                )}
                <button onClick={handleRefuse} className="w-full py-3 bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#4B5563] rounded-2xl font-bold transition border-b-4 border-[#9CA3AF] active:translate-y-1">
                  ปฏิเสธอย่างสุภาพ
                </button>
              </div>
            </div>

          </div>
        </div>

        {popupMessage && <PopupMessage message={popupMessage} />}
        {showInventory && <InventoryModal inventory={inventory} onClose={() => setShowInventory(false)} />}
        {showKnowledge && <KnowledgeModal onClose={() => setShowKnowledge(false)} />}
      </div>
    );
  }

  return null;
}

// --- EXPLORE MODULE ---

const EXPLORE_ZONES = [
  { id: 'capital', name: 'พระนครศรีอยุธยา', icon: '🏰', reqLevel: 1, story: 'พระนครคือเมืองหลวงและศูนย์กลางการค้า! มีกรมท่าต้อนรับพ่อค้า และพระคลังสินค้าควบคุมของหลวง', knowledge: 'รัฐมีบทบาทสำคัญควบคุมและผูกขาดสินค้า สร้างความมั่งคั่งให้ศูนย์กลาง', position: { left: '45%', top: '35%' }, bgImage: 'https://www.transparenttextures.com/patterns/rice-paper-2.png' },
  { id: 'basin', name: 'ลุ่มแม่น้ำเจ้าพระยา', icon: '🌾', reqLevel: 1, story: 'ชาวนาปลูกข้าวได้มากบนผืนดินอุดมสมบูรณ์ ทำให้อยุธยามีเสบียงและ "ข้าว" เป็นสินค้าส่งออกหลัก!', knowledge: 'ภูมิศาสตร์อุดมสมบูรณ์ ทำให้เกิดสินค้าเกษตรต้นทุนต่ำ ส่งเข้าพระนคร', position: { left: '35%', top: '15%' }, bgImage: 'https://www.transparenttextures.com/patterns/rice-paper-2.png' },
  { id: 'forest', name: 'หัวเมืองป่าชายแดน', icon: '🌲', reqLevel: 3, story: 'พรานป่าหาไม้กฤษณาและหนังสัตว์ ของมีค่าที่ฝรั่งและญี่ปุ่นชอบนัก! แต่นี่คือ "สินค้าหลวง" นะ', knowledge: 'หัวเมืองส่งส่วยทรัพยากรป่าไม้เข้ามา แสดงความต่างระหว่างสินค้าเสรีและผูกขาด', position: { left: '20%', top: '40%' }, bgImage: 'https://www.transparenttextures.com/patterns/rice-paper-2.png' },
  { id: 'mine', name: 'หัวเมืองแร่', icon: '⛏️', reqLevel: 4, story: 'เราพบแร่ดีบุกมากมายที่นี่ พ่อค้าชาวฮอลันดา (VOC) ยอมจ่ายไม่อั้นเพื่อเหมาดีบุกของเรา!', knowledge: 'ทรัพยากรเฉพาะถิ่น (แร่) ตรงกับความต้องการของต่างชาติ (ยุโรปใช้ผสมโลหะ)', position: { left: '25%', top: '75%' }, bgImage: 'https://www.transparenttextures.com/patterns/rice-paper-2.png' },
  { id: 'port', name: 'ท่าเรือนานาชาติ', icon: '🚢', reqLevel: 5, story: 'เรือสำเภาจากสารทิศจอดเรียงราย ทั้งจีน ญี่ปุ่น แขก และฝรั่ง แลกเปลี่ยนสินค้ากันคึกคัก', knowledge: 'ศูนย์กลางการค้าโลก ใช้เงินพดด้วง และยอมรับการชั่งน้ำหนักเงินตราต่างชาติ', position: { left: '75%', top: '65%' }, bgImage: 'https://www.transparenttextures.com/patterns/rice-paper-2.png' },
];

const ExploreMapModal = ({ level, canExplore, setCanExplore, setInventory, setScore, setActiveBuff, exploredZones, setExploredZones, checkAndAwardExplorerBadge, showResultPopup, onClose }) => {
  const [selectedZone, setSelectedZone] = useState(null);

  const handleClaimReward = () => {
    if (!canExplore) return;
    setCanExplore(false);
    onClose();

    const zone = selectedZone;
    let title = 'ได้รับของกำนัล!';
    let desc = '';
    
    if (zone.id === 'capital') {
      if (Math.random() > 0.5) { setScore(s => s + 2); desc = `ขุนนางมอบรางวัลให้ท่าน 2 พดด้วง`; }
      else { setInventory(prev => ({ ...prev, fabric: prev.fabric + 1 })); desc = `ชาวบ้านมอบผ้าทอให้ท่าน 1 ชิ้น`; }
    } else if (zone.id === 'basin') {
      const riceAmount = 2; setInventory(prev => ({ ...prev, rice: prev.rice + riceAmount })); setActiveBuff({ target: 'rice', type: 'buy', effect: -1 });
      desc = `ได้ข้าว ${riceAmount} กระสอบ\n\n✨ บัฟ: ซื้อข้าวถูกลง 1 พดด้วง (1 ด่าน)`;
    } else if (zone.id === 'forest') {
      if (Math.random() > 0.5) { setInventory(prev => ({ ...prev, wood: prev.wood + 1 })); desc = `พรานป่ามอบ ไม้กฤษณา 1 ชิ้น`; }
      else { setInventory(prev => ({ ...prev, skin: prev.skin + 1 })); desc = `พรานป่ามอบ หนังสัตว์ 1 ชิ้น`; }
    } else if (zone.id === 'mine') {
      setInventory(prev => ({ ...prev, tin: prev.tin + 1 })); setActiveBuff({ target: 'tin', type: 'sell', effect: 1 });
      desc = `ขุดพบ ดีบุก 1 ชิ้น\n\n✨ บัฟ: ขายดีบุกกำไรเพิ่ม 1 พดด้วง (1 ด่าน)`;
    } else if (zone.id === 'port') {
      const items = ['silk', 'spice', 'weapons']; const itemKey = items[Math.floor(Math.random() * items.length)];
      setScore(s => s + 2); setInventory(prev => ({ ...prev, [itemKey]: prev[itemKey] + 1 }));
      desc = `รับเงิน 2 พดด้วง และ ${ITEMS[itemKey].name} 1 ชิ้น`;
    }

    const newExplored = [...exploredZones];
    if (!newExplored.includes(zone.id)) { newExplored.push(zone.id); setExploredZones(newExplored); }
    showResultPopup(title, desc, 'success', () => checkAndAwardExplorerBadge(newExplored));
  };

  if (!selectedZone) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 z-50">
        <div className="bg-[#EEDC82] rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl border-8 border-[#8B5A2B] overflow-hidden relative" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")' }}>
          
          <div className="bg-[#8B5A2B] text-[#FFF8DC] p-3 flex justify-between items-center shrink-0 border-b-4 border-[#5C3A21]">
            <h2 className="text-xl font-black flex items-center gap-2"><MapIcon /> แผนที่วาดมือแห่งอยุธยา</h2>
            <button onClick={onClose} className="bg-[#CD853F] p-1.5 rounded-full hover:bg-red-500 transition"><X size={20} /></button>
          </div>

          <div className="flex-1 relative overflow-hidden p-4">
             {/* Map Art Background (Cartoon Winding River) */}
             <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none">
               <path d="M 50,0 Q 200,200 400,400 T 800,800" stroke="#87CEEB" strokeWidth="60" fill="none" strokeLinecap="round" />
               <path d="M 800,0 Q 600,300 400,400 T 50,800" stroke="#87CEEB" strokeWidth="40" fill="none" strokeLinecap="round" />
             </svg>
             {/* Small decorations */}
             <div className="absolute top-1/4 right-1/4 text-3xl opacity-50">⛰️</div>
             <div className="absolute bottom-1/4 left-1/4 text-3xl opacity-50">⛰️</div>
             <div className="absolute top-1/2 left-1/2 text-2xl opacity-60 animate-idle">🛶</div>

             {EXPLORE_ZONES.map(zone => {
                const isUnlocked = level >= zone.reqLevel;
                const isExplored = exploredZones.includes(zone.id);
                return (
                  <button key={zone.id} onClick={() => isUnlocked && setSelectedZone(zone)} className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-transform hover:scale-110 ${!isUnlocked ? 'grayscale cursor-not-allowed opacity-80' : 'cursor-pointer'}`} style={zone.position}>
                    <div className={`w-16 h-16 flex items-center justify-center rounded-full text-4xl shadow-xl border-4 ${isUnlocked ? 'bg-[#FFF8DC] border-[#D97706]' : 'bg-gray-300 border-gray-500'} relative z-10`}>
                       {zone.icon}
                       {!isUnlocked && <Lock className="absolute text-gray-700 w-6 h-6 bg-white/50 rounded-full" />}
                       {isExplored && <CheckCircle className="absolute -top-2 -right-2 text-[#10B981] bg-white rounded-full w-6 h-6 border-2 border-white" />}
                    </div>
                    <div className="mt-2 text-center bg-[#FFF8DC]/90 px-3 py-1 rounded-lg border-2 border-[#D97706] shadow-md">
                       <span className="text-[#8B5A2B] text-xs font-black whitespace-nowrap">{zone.name}</span>
                       {!isUnlocked && <div className="text-[10px] text-red-600 font-bold mt-0.5">Lv.{zone.reqLevel}</div>}
                    </div>
                  </button>
                );
             })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 z-50">
      <div className={`bg-[#FFFBF0] rounded-3xl w-full max-w-4xl h-[80vh] flex flex-col md:flex-row shadow-2xl border-8 border-[#8B5A2B] overflow-hidden relative`}>
        <button onClick={() => setSelectedZone(null)} className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full hover:bg-red-500 hover:text-white transition z-20 border-2 border-gray-400">
          <X size={20} />
        </button>

        {/* Left Side: Character */}
        <div className={`md:w-5/12 bg-[#E0F7FA] flex flex-col items-center justify-center p-6 relative overflow-hidden`} style={{ backgroundImage: `url(${selectedZone.bgImage})` }}>
           <h2 className="text-3xl font-black text-[#5C3A21] mb-6 z-10 flex items-center gap-2 text-center bg-white/60 px-4 py-2 rounded-2xl border-2 border-[#D97706]">
             <span>{selectedZone.icon}</span> {selectedZone.name}
           </h2>
           <div className="text-9xl mb-4 drop-shadow-xl z-10 bg-white/80 rounded-[40px] p-6 border-4 border-[#D97706] animate-idle">
             🧔🏽‍♂️
           </div>
           <div className="bg-[#8B5A2B] text-[#FFF8DC] px-5 py-2 rounded-full font-black text-sm shadow-md z-10 border-2 border-[#5C3A21]">
             ขุนพ่อค้าผู้รอบรู้
           </div>
        </div>

        {/* Right Side: Content Box */}
        <div className="md:w-7/12 p-6 md:p-10 flex flex-col bg-[#FFFBF0]">
           <button onClick={() => setSelectedZone(null)} className="text-[#D97706] font-black mb-4 flex items-center gap-1 w-max hover:text-[#8B5A2B]">
             &larr; กลับไปดูแผนที่
           </button>

           <div className="flex-1 overflow-y-auto">
             <div className="bg-white p-6 rounded-3xl shadow-sm border-4 border-[#FDE68A] mb-6 relative">
               <p className="text-lg text-[#5C3A21] leading-relaxed font-bold">"{selectedZone.story}"</p>
             </div>
             <div className="bg-[#E0F2FE] p-5 rounded-3xl border-2 border-[#BAE6FD] mb-6 shadow-inner">
               <div className="flex items-center gap-2 text-[#0369A1] font-black mb-2">
                 <BookOpen size={20} /> <span>สมุดบันทึกความรู้</span>
               </div>
               <p className="text-[#0C4A6E] text-sm font-medium">{selectedZone.knowledge}</p>
             </div>
           </div>

           <div className="pt-4 shrink-0">
             <button onClick={handleClaimReward} className="w-full py-4 bg-gradient-to-b from-[#34D399] to-[#10B981] hover:brightness-110 text-white text-xl font-black rounded-2xl shadow-lg border-b-4 border-[#059669] transition active:translate-y-1 flex justify-center items-center gap-2">
               <Gift size={24} /> รับความรู้และของกำนัล
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Modals Shared ---

const MarketModal = ({ inventory, setInventory, score, setScore, onClose, currentEvent }) => {
  const [msg, setMsg] = useState(null);
  const marketItems = ['rice', 'pottery', 'wicker', 'fabric', 'dried_food', 'salt', 'sugar', 'dried_fish', 'fruit', 'coconut_oil'];

  const handleBuyMarket = (itemKey, cost) => {
    if (score >= cost) {
      setScore(s => s - cost); setInventory(prev => ({ ...prev, [itemKey]: (prev[itemKey] || 0) + 1 }));
      setMsg(`✔️ ซื้อ ${ITEMS[itemKey].name} แล้ว`); setTimeout(() => setMsg(null), 1500);
    } else {
      setMsg("❌ เงินไม่พอจ้ะ!"); setTimeout(() => setMsg(null), 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#FFFBF0] rounded-3xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl border-8 border-[#8B5A2B] overflow-hidden relative">
        <div className="bg-[#8B5A2B] text-[#FFF8DC] p-4 flex justify-between items-center border-b-4 border-[#5C3A21]">
          <h2 className="text-xl font-black flex items-center gap-2"><Store /> ลานตลาดหน้าวัด</h2>
          <button onClick={onClose} className="bg-[#CD853F] p-1.5 rounded-full hover:bg-red-500 transition"><X size={20} /></button>
        </div>
        
        <div className="p-4 bg-[#FFEDD5] flex justify-between items-center border-b-4 border-[#FDBA74]">
          <span className="text-[#8B5A2B] font-bold text-sm md:text-base">เลือกซื้อเสบียงจากชาวบ้าน</span>
          <div className="bg-white text-[#D97706] px-3 py-1.5 rounded-full font-black flex items-center gap-1 shadow-sm border-2 border-[#FDE68A]">
            <Coins size={16} /> <span>{score} พดด้วง</span>
          </div>
        </div>

        {msg && <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-[#5C3A21] text-white px-6 py-2 rounded-full text-sm font-black shadow-xl z-20 animate-bounce">{msg}</div>}

        <div className="p-4 overflow-y-auto flex-1 bg-[#FFF8DC]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")', opacity: 0.95 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {marketItems.map(key => {
              const item = ITEMS[key]; const count = inventory[key] || 0;
              let buyPrice = Math.max(1, item.buyPrice + (currentEvent.target === key ? currentEvent.effect : 0));
              return (
                <div key={key} className="p-4 rounded-2xl border-4 border-[#DEB887] bg-white flex flex-col items-center text-center shadow-md relative">
                  {currentEvent.target === key && currentEvent.effect !== 0 && (
                    <span className={`absolute -top-3 -right-3 text-[10px] font-black text-white px-2 py-1 rounded-full border-2 border-white shadow-sm ${currentEvent.effect > 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                      {currentEvent.effect > 0 ? 'แพงขึ้น' : 'ถูกลง'}
                    </span>
                  )}
                  <div className="text-4xl mb-2 bg-[#F3F4F6] p-3 rounded-2xl border-2 border-[#E5E7EB]">{item.icon}</div>
                  <span className="text-sm font-black text-[#5C3A21] mb-1">{item.name}</span>
                  <span className="text-[10px] font-bold text-gray-500 mb-3 bg-gray-100 px-2 py-0.5 rounded-md">ในคลัง: {count}</span>
                  <button onClick={() => handleBuyMarket(key, buyPrice)} className={`w-full py-2 rounded-xl font-black text-sm border-b-4 active:translate-y-1 transition ${score >= buyPrice ? 'bg-gradient-to-b from-[#FDE047] to-[#F59E0B] border-[#B45309] text-[#78350F]' : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'}`}>
                    ซื้อ {buyPrice}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const InventoryModal = ({ inventory, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#FFFBF0] rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl border-8 border-[#8B5A2B] overflow-hidden">
        <div className="bg-[#8B5A2B] text-[#FFF8DC] p-4 flex justify-between items-center border-b-4 border-[#5C3A21]">
          <h2 className="text-xl font-black flex items-center gap-2"><Package /> โกดังสินค้าไม้</h2>
          <button onClick={onClose} className="bg-[#CD853F] p-1.5 rounded-full hover:bg-red-500 transition"><X size={20} /></button>
        </div>
        <div className="p-4 overflow-y-auto flex-1 bg-[#FFF8DC]">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {Object.values(ITEMS).map(item => {
                const count = inventory[item.id] || 0;
                return (
                  <div key={item.id} className={`p-2 rounded-2xl border-4 flex flex-col items-center justify-center relative ${count > 0 ? 'bg-white border-[#DEB887] shadow-sm' : 'bg-gray-100 border-gray-200 opacity-60 grayscale'}`}>
                    <span className="text-3xl mb-1">{item.icon}</span>
                    <span className="text-[10px] font-black text-[#5C3A21] truncate w-full text-center">{item.name}</span>
                    <span className="absolute -top-2 -right-2 text-xs font-black bg-[#F59E0B] text-white px-2 py-0.5 rounded-full border-2 border-white shadow-sm">{count}</span>
                  </div>
                )
              })}
            </div>
        </div>
      </div>
    </div>
  );
};

const KnowledgeModal = ({ onClose }) => {
  const [tab, setTab] = useState('sampao');
  const tabs = [{ id: 'sampao', label: 'ราคา' }, { id: 'kromtha', label: 'กรมท่า' }, { id: 'phrakhlang', label: 'พระคลัง' }, { id: 'money', label: 'เงินตรา' }];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#FFFBF0] rounded-3xl w-full max-w-lg shadow-2xl border-8 border-[#8B5A2B] overflow-hidden flex flex-col">
        <div className="bg-[#8B5A2B] text-[#FFF8DC] p-4 flex justify-between items-center border-b-4 border-[#5C3A21]">
          <h2 className="text-xl font-black flex items-center gap-2"><BookOpen /> สมุดข่อยบันทึก</h2>
          <button onClick={onClose} className="bg-[#CD853F] p-1.5 rounded-full hover:bg-red-500 transition"><X size={20} /></button>
        </div>
        <div className="flex bg-[#DEB887]">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 py-3 px-2 font-black text-sm whitespace-nowrap border-b-4 ${tab === t.id ? 'bg-[#FFFBF0] text-[#8B5A2B] border-[#8B5A2B]' : 'text-[#5C3A21] border-transparent hover:bg-[#D2B48C]'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh] text-[#5C3A21]">
           {tab === 'sampao' && (<div><h3 className="text-xl font-black text-center mb-4">สูตรเศรษฐี</h3><div className="bg-white p-4 rounded-2xl border-4 border-[#FDE68A] text-center font-bold text-lg">กำไร = ราคาขายสุทธิ - ต้นทุน</div></div>)}
           {tab === 'kromtha' && (<div><h3 className="text-xl font-black text-center mb-4">กรมท่า</h3><p className="bg-white p-4 rounded-2xl border-4 border-[#BAE6FD] font-medium">ดูแลและควบคุมการค้ากับต่างประเทศ เก็บภาษีปากเรือ (จังกอบ)</p></div>)}
           {tab === 'phrakhlang' && (<div><h3 className="text-xl font-black text-center mb-4">พระคลังสินค้า</h3><div className="space-y-2"><p className="bg-[#FEE2E2] p-3 rounded-xl border-2 border-[#FCA5A5] text-sm font-bold text-[#B91C1C]">สินค้าหลวง: ห้ามขายเอง ต้องขออนุญาตเสียภาษี</p><p className="bg-[#D1FAE5] p-3 rounded-xl border-2 border-[#6EE7B7] text-sm font-bold text-[#047857]">สินค้าเสรี: ค้าขายได้อิสระ</p></div></div>)}
           {tab === 'money' && (<div><h3 className="text-xl font-black text-center mb-4">เงินพดด้วง</h3><p className="bg-white p-4 rounded-2xl border-4 border-[#E5E7EB] font-medium text-center">เงินตราหลัก ทำจากแร่เงินแท้ มีตราประทับของหลวง</p></div>)}
        </div>
      </div>
    </div>
  );
};

const PopupMessage = ({ message }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
    <div className="bg-[#FFFBF0] rounded-[30px] p-6 max-w-sm w-full text-center shadow-2xl border-8 border-[#8B5A2B] animate-idle" style={{ animationDuration: '0.4s', animationIterationCount: 1 }}>
      <div className="flex justify-center mb-4">
        {message.type === 'success' && <div className="bg-[#D1FAE5] p-4 rounded-full border-4 border-[#34D399]"><CheckCircle size={50} className="text-[#059669]" /></div>}
        {message.type === 'warning' && <div className="bg-[#FEF3C7] p-4 rounded-full border-4 border-[#FBBF24]"><AlertTriangle size={50} className="text-[#D97706]" /></div>}
        {message.type === 'error' && <div className="bg-[#FEE2E2] p-4 rounded-full border-4 border-[#F87171]"><X size={50} className="text-[#B91C1C]" /></div>}
      </div>
      <h2 className="text-2xl font-black text-[#5C3A21] mb-2">{message.title}</h2>
      <p className="text-[#8B5A2B] mb-6 font-medium whitespace-pre-line">{message.desc}</p>
      <button onClick={message.action} className="w-full py-4 bg-gradient-to-b from-[#FDE047] to-[#F59E0B] text-[#78350F] font-black rounded-2xl shadow-md border-b-4 border-[#B45309] active:translate-y-1 transition text-lg">
        ตกลงรับทราบ
      </button>
    </div>
  </div>
);

// Global Styles for Custom Animations
const GlobalStyles = () => (
  <style>{`
    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
    .animate-float { animation: float 6s ease-in-out infinite; }
    
    @keyframes idle { 0% { transform: translateY(0px); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0px); } }
    .animate-idle { animation: idle 2s ease-in-out infinite; }
    
    @keyframes sail-across { 0% { transform: translateX(-100vw) rotate(5deg); } 50% { transform: translateX(0) rotate(-2deg); } 100% { transform: translateX(100vw) rotate(5deg); } }
    .animate-sail-across { animation: sail-across 1.5s ease-in-out forwards; }
  `}</style>
);
