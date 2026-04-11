import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const scoreEmoji = sc => sc===5?"🏆":sc>=4?"⭐":sc>=3?"👍":"📚";
const totalStars = scores =>
  Object.values(scores).reduce((a,s)=>a+(s===5?3:s>=4?2:s>=3?1:0),0);

const makeThemes = (pid) => {
  const SAL_L1 = [
    {fr:"Bonjour (le matin)",  it:"Buongiorno",    pr:"bou-on-DJOR-no"},
    {fr:"Bonsoir",             it:"Buonasera",     pr:"bou-o-na-SÉ-ra"},
    {fr:"Salut ! (familier)",  it:"Ciao !",        pr:"TCHAO"},
    {fr:"Au revoir",           it:"Arrivederci",   pr:"a-ri-vé-DÈR-tchi"},
    {fr:"Bonne nuit",          it:"Buonanotte",    pr:"bou-o-na-NOT-té"},
  ];
  const SAL_L2 = [
    {fr:"Je m'appelle…",           it:"Mi chiamo…",     pr:"mi KIA-mo"},
    {fr:"Comment tu t'appelles ?", it:"Come ti chiami?",pr:"KO-mé ti KIA-mi"},
    {fr:"Enchanté(e) !",           it:"Piacere!",       pr:"pia-TCHÉ-ré"},
    {fr:"Comment allez-vous ?",    it:"Come stai?",     pr:"KO-mé stai"},
    {fr:"Bien, merci !",           it:"Bene, grazie!",  pr:"BÉ-né GRA-tsié"},
  ];
  const SAL_L3 = [
    {fr:"S'il vous plaît", it:"Per favore", pr:"pèr fa-VO-ré"},
    {fr:"Merci !",         it:"Grazie!",    pr:"GRA-tsié"},
    {fr:"De rien",         it:"Prego",      pr:"PRÉ-go"},
    {fr:"Excusez-moi",     it:"Scusi",      pr:"SKOU-zi"},
    {fr:"Pardon !",        it:"Permesso!",  pr:"pèr-MÈS-so"},
  ];
  const RES_L1 = [
    {fr:"Un café, s'il vous plaît",    it:"Un caffè, per favore",  pr:"oun kaf-FÈ pèr fa-VO-ré"},
    {fr:"Un cappuccino",               it:"Un cappuccino",         pr:"oun kap-pou-TCHI-no"},
    {fr:"L'addition, s'il vous plaît", it:"Il conto, per favore",  pr:"il KON-to pèr fa-VO-ré"},
    {fr:"Eau plate ou gazeuse ?",      it:"Naturale o frizzante?", pr:"na-tou-RA-lé o friz-ZAN-té"},
    {fr:"Où sont les toilettes ?",     it:"Dov'è il bagno?",       pr:"do-VÈ il BA-nio"},
  ];
  const RES_L2 = {
    p1:[
      {fr:"Une table pour deux",     it:"Un tavolo per due",  pr:"oun TA-vo-lo pèr DOU-é"},
      {fr:"Je voudrais un dessert",  it:"Vorrei un dolce",    pr:"vor-RÉI oun DOL-tshe"},
      {fr:"Avez-vous de la glace ?", it:"Avete il gelato?",   pr:"a-VÉ-té il djé-LA-to"},
      {fr:"C'est très sucré ?",      it:"È molto dolce?",     pr:"è MOL-to DOL-tshe"},
      {fr:"C'est délicieux !",       it:"È delizioso!",       pr:"è dé-li-TSIO-zo"},
    ],
    p2:[
      {fr:"Une table avec vue",            it:"Un tavolo con vista",        pr:"oun TA-vo-lo kon VIS-ta"},
      {fr:"La spécialité de la maison ?",  it:"La specialità della casa?",  pr:"la spé-tsha-li-TÀ DÈL-la KA-za"},
      {fr:"Un verre de vin rouge",         it:"Un bicchiere di vino rosso", pr:"oun bik-KIÈ-ré di VI-no ROS-so"},
      {fr:"C'est un plat typique d'ici ?", it:"È un piatto tipico di qui?", pr:"è oun PIAT-to TI-pi-ko di koui"},
      {fr:"C'est délicieux !",             it:"È delizioso!",               pr:"è dé-li-TSIO-zo"},
    ],
    p3:[
      {fr:"Une table en terrasse",   it:"Un tavolo in terrazza",  pr:"oun TA-vo-lo in tèr-RAT-tsa"},
      {fr:"Le menu du jour",         it:"Il menù del giorno",     pr:"il mé-NOU dèl DJOR-no"},
      {fr:"Je suis végétarien(ne)",  it:"Sono vegetariano/a",     pr:"SO-no vé-dié-ta-RIA-no/a"},
      {fr:"C'est un plat local ?",   it:"È un piatto locale?",    pr:"è oun PIAT-to lo-KA-lé"},
      {fr:"C'est délicieux !",       it:"È delizioso!",           pr:"è dé-li-TSIO-zo"},
    ],
  };
  const RES_L3 = [
    {fr:"Je voudrais…",          it:"Vorrei…",            pr:"vor-RÉI"},
    {fr:"Que conseillez-vous ?", it:"Cosa mi consiglia?", pr:"KO-za mi kon-SI-lia"},
    {fr:"J'ai faim !",           it:"Ho fame!",           pr:"o FA-mé"},
    {fr:"J'ai soif !",           it:"Ho sete!",           pr:"o SÉ-té"},
    {fr:"C'est inclus ?",        it:"È incluso?",         pr:"è in-KLOU-zo"},
  ];
  const TRA_L1 = {
    p1:[
      {fr:"Où est la gare ?",               it:"Dov'è la stazione?",        pr:"do-VÈ la sta-TSIO-né"},
      {fr:"Un billet pour Rome",            it:"Un biglietto per Roma",     pr:"oun bi-LIÈ-to pèr RO-ma"},
      {fr:"À quelle heure part le train ?", it:"A che ora parte il treno?", pr:"a ké O-ra PAR-té il TRÉ-no"},
      {fr:"Combien ça coûte ?",             it:"Quanto costa?",             pr:"KOUAN-to KOS-ta"},
      {fr:"C'est loin d'ici ?",             it:"È lontano da qui?",         pr:"è lon-TA-no da koui"},
    ],
    p2:[
      {fr:"Y a-t-il un bus pour le musée ?", it:"C'è un autobus per il museo?", pr:"tshè oun aouto-BOUS pèr il mou-ZÉ-o"},
      {fr:"Un billet pour Florence",         it:"Un biglietto per Firenze",     pr:"oun bi-LIÈ-to pèr fi-RÈN-tsé"},
      {fr:"À quelle heure ouvre le musée ?", it:"A che ora apre il museo?",     pr:"a ké O-ra A-pré il mou-ZÉ-o"},
      {fr:"Combien de temps en taxi ?",      it:"Quanto tempo in taxi?",        pr:"KOUAN-to TÈM-po in TAK-si"},
      {fr:"À quelle heure part le train ?",  it:"A che ora parte il treno?",    pr:"a ké O-ra PAR-té il TRÉ-no"},
    ],
    p3:[
      {fr:"Où est la gare ?",               it:"Dov'è la stazione?",          pr:"do-VÈ la sta-TSIO-né"},
      {fr:"Un aller-retour pour Rome",      it:"Un andata e ritorno per Roma", pr:"oun an-DA-ta é ri-TOR-no pèr RO-ma"},
      {fr:"Le train rapide ou régional ?",  it:"Il treno veloce o regionale?", pr:"il TRÉ-no vé-LO-tshe o ré-djo-NA-lé"},
      {fr:"À quelle heure part le train ?", it:"A che ora parte il treno?",    pr:"a ké O-ra PAR-té il TRÉ-no"},
      {fr:"Combien ça coûte ?",             it:"Quanto costa?",                pr:"KOUAN-to KOS-ta"},
    ],
  };
  const TRA_L2 = [
    {fr:"Tournez à droite",  it:"Giri a destra",        pr:"DJI-ri a DÈS-tra"},
    {fr:"Tournez à gauche",  it:"Giri a sinistra",      pr:"DJI-ri a si-NIS-tra"},
    {fr:"Tout droit",        it:"Sempre dritto",        pr:"SÈM-pré DRIT-to"},
    {fr:"C'est loin ?",      it:"È lontano?",           pr:"è lon-TA-no"},
    {fr:"À combien de km ?", it:"A quanti chilometri?", pr:"a KOUAN-ti ki-LO-mé-tri"},
  ];
  const TRA_L3 = [
    {fr:"Où est le métro ?",       it:"Dov'è la metro?",      pr:"do-VÈ la MÉ-tro"},
    {fr:"Je dois descendre ici ?", it:"Devo scendere qui?",   pr:"DÉ-vo SHÈN-dé-ré koui"},
    {fr:"Je ne comprends pas",     it:"Non capisco",          pr:"non ka-PIS-ko"},
    {fr:"Pouvez-vous répéter ?",   it:"Può ripetere?",        pr:"pouo ri-PÉ-té-ré"},
    {fr:"Parlez plus lentement",   it:"Parli più lentamente", pr:"PAR-li piou lèn-ta-MÈN-té"},
  ];
  const SHO_L1 = [
    {fr:"Combien coûte ça ?",       it:"Quanto costa questo?", pr:"KOUAN-to KOS-ta KOUÉS-to"},
    {fr:"C'est trop cher",          it:"È troppo caro",        pr:"è TROP-po KA-ro"},
    {fr:"Je le prends !",           it:"Lo prendo!",           pr:"lo PRÈN-do"},
    {fr:"Puis-je l'essayer ?",      it:"Posso provarlo?",      pr:"POS-so pro-VAR-lo"},
    {fr:"Y a-t-il une réduction ?", it:"C'è uno sconto?",      pr:"tshè ou-no SKON-to"},
  ];
  const SHO_L2 = {
    p1:[
      {fr:"C'est frais ?",         it:"È fresco?",           pr:"è FRÈS-ko"},
      {fr:"Un kilo de fraises",    it:"Un chilo di fragole", pr:"oun KI-lo di FRA-go-lé"},
      {fr:"Une tranche de gâteau", it:"Una fetta di torta",  pr:"ou-na FÈT-ta di TOR-ta"},
      {fr:"C'est fait maison ?",   it:"È fatto in casa?",    pr:"è FAT-to in KA-za"},
      {fr:"Où sont les soldes ?",  it:"Dove sono i saldi?",  pr:"DO-vé SO-no i SAL-di"},
    ],
    p2:[
      {fr:"Avez-vous des livres d'art ?", it:"Avete libri d'arte?",   pr:"a-VÉ-té LI-bri DAR-té"},
      {fr:"C'est une reproduction ?",     it:"È una riproduzione?",   pr:"è ou-na ri-pro-dou-TSIO-né"},
      {fr:"Avez-vous le catalogue ?",     it:"Avete il catalogo?",    pr:"a-VÉ-té il ka-TA-lo-go"},
      {fr:"C'est fait à la main ?",       it:"È fatto a mano?",       pr:"è FAT-to a MA-no"},
      {fr:"Où sont les soldes ?",         it:"Dove sono i saldi?",    pr:"DO-vé SO-no i SAL-di"},
    ],
    p3:[
      {fr:"Où est la pharmacie ?",  it:"Dov'è la farmacia?",  pr:"do-VÈ la far-ma-TSHIA"},
      {fr:"Une carte SIM locale",   it:"Una SIM locale",      pr:"ou-na SIM lo-KA-lé"},
      {fr:"Un chargeur",            it:"Un caricabatterie",   pr:"oun ka-ri-ka-bat-TÉ-rié"},
      {fr:"C'est fait à la main ?", it:"È fatto a mano?",     pr:"è FAT-to a MA-no"},
      {fr:"Où sont les soldes ?",   it:"Dove sono i saldi?",  pr:"DO-vé SO-no i SAL-di"},
    ],
  };
  const SHO_L3 = [
    {fr:"Acceptez-vous les cartes ?", it:"Accettate le carte?",      pr:"at-tshèt-TA-té lé KAR-té"},
    {fr:"Un sac, s.v.p.",             it:"Un sacchetto, per favore", pr:"oun sak-KÈT-to pèr fa-VO-ré"},
    {fr:"Je cherche…",                it:"Cerco…",                   pr:"TSHÈR-ko"},
    {fr:"C'est un cadeau",            it:"È un regalo",              pr:"è oun ré-GA-lo"},
    {fr:"Je reviens demain",          it:"Torno domani",             pr:"TOR-no do-MA-ni"},
  ];
  const HOT_L1 = [
    {fr:"J'ai une réservation",       it:"Ho una prenotazione",       pr:"o ou-na pré-no-ta-TSIO-né"},
    {fr:"Une chambre double",         it:"Una camera doppia",         pr:"ou-na KA-mé-ra DOP-pia"},
    {fr:"Check-out à quelle heure ?", it:"A che ora è il check-out?", pr:"a ké O-ra è il shèk-AUT"},
    {fr:"Le WiFi fonctionne ?",       it:"Il WiFi funziona?",         pr:"il ouai-fai foun-TSIO-na"},
    {fr:"Où est l'ascenseur ?",       it:"Dov'è l'ascensore?",        pr:"do-VÈ la-shèn-SO-ré"},
  ];
  const HOT_L2 = [
    {fr:"Le chauffage ne marche pas",   it:"Il riscaldamento non funziona", pr:"il ris-kal-da-MÈN-to non foun-TSIO-na"},
    {fr:"Je peux laisser mes bagages ?",it:"Posso lasciare i bagagli?",     pr:"POS-so la-SHA-ré i ba-GA-li"},
    {fr:"Il y a la clim ?",             it:"C'è l'aria condizionata?",      pr:"tshè LA-ria kon-di-tsio-NA-ta"},
    {fr:"J'ai perdu ma clé",            it:"Ho perso la chiave",            pr:"o PÈR-zo la KIA-vé"},
    {fr:"Plus de serviettes, s.v.p.",   it:"Più asciugamani, per favore",   pr:"piou a-shou-ga-MA-ni"},
  ];
  const HOT_L3 = [
    {fr:"Au secours !",             it:"Aiuto!",                  pr:"a-IOU-to"},
    {fr:"Appelez la police !",      it:"Chiamate la polizia!",    pr:"kia-MA-té la po-LI-tsia"},
    {fr:"J'ai besoin d'un médecin", it:"Ho bisogno di un medico", pr:"o bi-ZO-nio di oun MÉ-di-ko"},
    {fr:"Où est la pharmacie ?",    it:"Dov'è la farmacia?",      pr:"do-VÈ la far-ma-TSHIA"},
    {fr:"J'ai perdu mon passeport", it:"Ho perso il passaporto",  pr:"o PÈR-zo il pas-sa-POR-to"},
  ];
    const GRAM_ESSERE = {
    id:3, type:"grammar", title:"ESSERE (être) au présent",
    intro:"Le verbe 'être' est le plus important ! Conjugaison complète :",
    tip:"💡 En italien on peut omettre le pronom. 'Sono Marco' = 'Je suis Marco' !",
    items:[
      {fr:"Je suis",        it:"Io sono",   pr:"io SO-no"},
      {fr:"Tu es",          it:"Tu sei",    pr:"tou SÉI"},
      {fr:"Il/Elle est",    it:"Lui/Lei è", pr:"loui/léi È"},
      {fr:"Nous sommes",    it:"Noi siamo", pr:"noi SIA-mo"},
      {fr:"Vous êtes",      it:"Voi siete", pr:"voi SIÉ-té"},
      {fr:"Ils/Elles sont", it:"Loro sono", pr:"LO-ro SO-no"},
    ]};
  const GRAM_VOLERE = {
    id:3, type:"grammar", title:"VOLERE (vouloir) au présent",
    intro:"Essentiel pour commander ! Utilise 'Vorrei' pour être poli.",
    tip:"💡 'Vorrei' (je voudrais) est plus poli que 'Voglio' (je veux). Utilise-le toujours au restaurant !",
    items:[
      {fr:"Je veux",      it:"Io voglio",     pr:"io VO-lio"},
      {fr:"Tu veux",      it:"Tu vuoi",       pr:"tou VOUOI"},
      {fr:"Il/Elle veut", it:"Lui/Lei vuole", pr:"loui/léi VOUO-lé"},
      {fr:"Nous voulons", it:"Noi vogliamo",  pr:"noi vo-LIA-mo"},
      {fr:"Vous voulez",  it:"Voi volete",    pr:"voi vo-LÉ-té"},
      {fr:"Ils veulent",  it:"Loro vogliono", pr:"LO-ro VO-lio-no"},
    ]};
  const GRAM_ANDARE = {
    id:3, type:"grammar", title:"ANDARE (aller) au présent",
    intro:"Le verbe 'aller' est indispensable en voyage !",
    tip:"💡 'Vado a Roma' = 'Je vais à Rome'. 'Andiamo!' = 'Allons-y !' — très utilisé !",
    items:[
      {fr:"Je vais",        it:"Io vado",     pr:"io VA-do"},
      {fr:"Tu vas",         it:"Tu vai",      pr:"tou VAI"},
      {fr:"Il/Elle va",     it:"Lui/Lei va",  pr:"loui/léi VA"},
      {fr:"Nous allons",    it:"Noi andiamo", pr:"noi an-DIA-mo"},
      {fr:"Vous allez",     it:"Voi andate",  pr:"voi an-DA-té"},
      {fr:"Ils/Elles vont", it:"Loro vanno",  pr:"LO-ro VAN-no"},
    ]};
  const GRAM_AVERE_PASSE = {
    id:3, type:"grammar", title:"Le passé avec AVERE (avoir)",
    intro:"Pour raconter ce qu'on a fait ! Formule : avoir + participe passé.",
    tip:"💡 En italien le passé = 'avere' + participe passé. C'est le 'passato prossimo' !",
    items:[
      {fr:"J'ai acheté",     it:"Ho comprato",    pr:"o kom-PRA-to"},
      {fr:"Tu as vu",        it:"Hai visto",      pr:"ai VIS-to"},
      {fr:"Il/Elle a mangé", it:"Ha mangiato",    pr:"a man-DJA-to"},
      {fr:"Nous avons payé", it:"Abbiamo pagato", pr:"ab-BIA-mo pa-GA-to"},
      {fr:"Vous avez pris",  it:"Avete preso",    pr:"a-VÉ-té PRÉ-zo"},
      {fr:"Ils ont dormi",   it:"Hanno dormito",  pr:"AN-no dor-MI-to"},
    ]};
  const GRAM_FUTUR = {
    id:3, type:"grammar", title:"Le futur en italien",
    intro:"Pour parler de demain et des prochains jours !",
    tip:"💡 Terminaisons du futur : -rò, -rai, -rà, -remo, -rete, -ranno. Facile !",
    items:[
      {fr:"Je visiterai",      it:"Visiterò",   pr:"vi-zi-té-RÒ"},
      {fr:"Tu mangeras",       it:"Mangerai",   pr:"man-djé-RAI"},
      {fr:"Il/Elle ira",       it:"Andrà",      pr:"an-DRÀ"},
      {fr:"Nous partirons",    it:"Partiremo",  pr:"par-ti-RÉ-mo"},
      {fr:"Vous arriverez",    it:"Arriverete", pr:"ar-ri-vé-RÉ-té"},
      {fr:"Ils/Elles verront", it:"Vedranno",   pr:"vé-DRAN-no"},
    ]};
  const BONUS = {
    p1:{
      id:"bonus", emoji:"🍦", title:"Douceurs & Spécialités",
      subtitle:"Gelato, chocolat et spécialités italiennes", color:"#D4387A", light:"#FFF0F7",
      lessons:[
        {id:0, type:"phrases", title:"À la gelateria 🍦",
          intro:"Le gelato italien est différent (et bien meilleur) de la glace ordinaire !",
          items:[
            {fr:"Une glace",       it:"Un gelato",        pr:"oun djé-LA-to"},
            {fr:"Deux boules",     it:"Due palline",      pr:"dou-é pal-LI-né"},
            {fr:"Sur un cône",     it:"In un cono",       pr:"in oun KO-no"},
            {fr:"Parfum chocolat", it:"Gusto cioccolato", pr:"GOUS-to tshok-ko-LA-to"},
            {fr:"Parfum pistache", it:"Gusto pistacchio", pr:"GOUS-to pis-TAK-kio"},
          ]},
        {id:1, type:"phrases", title:"Les parfums 🎨",
          intro:"Les italiens ont des dizaines de parfums. Lequel préfères-tu ?",
          items:[
            {fr:"Fraise",    it:"Fragola",  pr:"FRA-go-la"},
            {fr:"Citron",    it:"Limone",   pr:"li-MO-né"},
            {fr:"Vanille",   it:"Vaniglia", pr:"va-NI-lia"},
            {fr:"Noisette",  it:"Nocciola", pr:"not-TSHO-la"},
            {fr:"Framboise", it:"Lampone",  pr:"lam-PO-né"},
          ]},
        {id:2, type:"phrases", title:"Chocolat & Pâtisseries 🍫",
          intro:"Turin est la capitale du chocolat en Italie. Un régal !",
          items:[
            {fr:"Un chocolat de Turin", it:"Un gianduiotto",      pr:"oun djan-douo-IOT-to"},
            {fr:"Du chocolat noir",     it:"Cioccolato fondente", pr:"tshok-ko-LA-to fon-DÈN-té"},
            {fr:"Un tiramisu",          it:"Un tiramisù",         pr:"oun ti-ra-mi-SOU"},
            {fr:"Un cannolo",           it:"Un cannolo",          pr:"oun kan-NO-lo"},
            {fr:"Panna cotta",          it:"Panna cotta",         pr:"PAN-na KOT-ta"},
          ]},
        {id:3, type:"grammar", title:"Adjectifs de goût 😋",
          intro:"Pour décrire ce qu'on mange !",
          tip:"💡 En italien, les adjectifs s'accordent : 'buono' (bon, masc.) → 'buona' (bonne, fém.) !",
          items:[
            {fr:"Délicieux/se", it:"Delizioso/a", pr:"dé-li-TSIO-zo/a"},
            {fr:"Sucré(e)",     it:"Dolce",       pr:"DOL-tshe"},
            {fr:"Amer/ère",     it:"Amaro/a",     pr:"a-MA-ro/a"},
            {fr:"Frais/fraîche",it:"Fresco/a",    pr:"FRÈS-ko/a"},
            {fr:"Chaud(e)",     it:"Caldo/a",     pr:"KAL-do/a"},
            {fr:"Froid(e)",     it:"Freddo/a",    pr:"FRÈD-do/a"},
          ]},
      ],
      quiz:[
        {q:"Comment dire 'une glace' en italien ?",opts:["Un sorbetto","Un gelato","Un dolce","Un cannolo"],a:1},
        {q:"Que signifie 'fragola' ?",opts:["Pistache","Framboise","Fraise","Noisette"],a:2},
        {q:"Qu'est-ce qu'un 'gianduiotto' ?",opts:["Un gâteau","Un chocolat de Turin","Un sorbet","Un beignet"],a:1},
        {q:"Comment dit-on 'sucré' en italien ?",opts:["Amaro","Fresco","Dolce","Caldo"],a:2},
        {q:"Comment dire 'deux boules de glace' ?",opts:["Due gelati","Due palline","Due coni","Due gusti"],a:1},
      ]},
    p2:{
      id:"bonus", emoji:"🎨", title:"Art, Musées & Culture",
      subtitle:"Œuvres, musées, architecture et Renaissance", color:"#7B5EA7", light:"#F5F0FF",
      lessons:[
        {id:0, type:"phrases", title:"Au musée 🖼️",
          intro:"L'Italie est le plus grand musée du monde !",
          items:[
            {fr:"Où acheter les billets ?",    it:"Dove si comprano i biglietti?", pr:"DO-vé si KOM-pra-no i bi-LIÈ-ti"},
            {fr:"À quelle heure ferme-t-il ?", it:"A che ora chiude?",             pr:"a ké O-ra KIOU-dé"},
            {fr:"Avez-vous un audioguide ?",   it:"Avete un'audioguida?",          pr:"a-VÉ-té oun ao-dio-GOUI-da"},
            {fr:"Défense de toucher",          it:"Vietato toccare",               pr:"vié-TA-to tok-KA-ré"},
            {fr:"La salle des peintures",      it:"La sala dei dipinti",           pr:"la SA-la déi di-PIN-ti"},
          ]},
        {id:1, type:"phrases", title:"Parler des œuvres 🖌️",
          intro:"Pour admirer et commenter comme une vraie experte en art !",
          items:[
            {fr:"Qui a peint ça ?",          it:"Chi ha dipinto questo?",  pr:"ki a di-PIN-to KOUÉS-to"},
            {fr:"C'est de quelle période ?", it:"Di che periodo è?",       pr:"di ké pé-RIO-do è"},
            {fr:"C'est une fresque",         it:"È un affresco",           pr:"è oun af-FRÈS-ko"},
            {fr:"C'est magnifique !",        it:"È magnifico!",            pr:"è ma-NI-fi-ko"},
            {fr:"Quelle belle architecture", it:"Che bella architettura!", pr:"ké BÈL-la ar-ki-tèt-TOU-ra"},
          ]},
        {id:2, type:"phrases", title:"Opéra & Réservations 🎭",
          intro:"Pour profiter pleinement de la vie culturelle italienne !",
          items:[
            {fr:"Deux billets pour ce soir", it:"Due biglietti per stasera",    pr:"dou-é bi-LIÈ-ti pèr sta-SÉ-ra"},
            {fr:"Y a-t-il des places ?",     it:"Ci sono posti disponibili?",   pr:"tshi SO-no POS-ti dis-po-NI-bi-li"},
            {fr:"À quelle heure commence ?", it:"A che ora inizia?",            pr:"a ké O-ra i-NI-tsia"},
            {fr:"Le programme de la semaine",it:"Il programma della settimana", pr:"il pro-GRAM-ma DÈL-la sèt-ti-MA-na"},
            {fr:"C'est complet ?",           it:"È tutto esaurito?",            pr:"è TOUT-to é-zaou-RI-to"},
          ]},
        {id:3, type:"grammar", title:"Vocabulaire de l'art 🏛️",
          intro:"Les mots essentiels pour parler d'art et d'architecture.",
          tip:"💡 'Rinascimento' (Renaissance) vient de 'rinascere' = renaître !",
          items:[
            {fr:"Un tableau",     it:"Un dipinto",      pr:"oun di-PIN-to"},
            {fr:"Une sculpture",  it:"Una scultura",    pr:"ou-na skoul-TOU-ra"},
            {fr:"Une cathédrale", it:"Un duomo",        pr:"oun DOUO-mo"},
            {fr:"La Renaissance", it:"Il Rinascimento", pr:"il ri-na-shi-MÈN-to"},
            {fr:"Un palais",      it:"Un palazzo",      pr:"oun pa-LAT-tso"},
            {fr:"Une fresque",    it:"Un affresco",     pr:"oun af-FRÈS-ko"},
          ]},
      ],
      quiz:[
        {q:"Comment demander à quelle heure le musée ferme ?",opts:["A che ora apre?","A che ora chiude?","Dove si comprano i biglietti?","C'è un audioguide?"],a:1},
        {q:"Que signifie 'È magnifico' ?",opts:["C'est original","C'est magnifique","C'est une fresque","C'est complet"],a:1},
        {q:"Comment dire 'La Renaissance' ?",opts:["Il Barocco","Il Medioevo","Il Rinascimento","Il Classicismo"],a:2},
        {q:"Comment demander s'il y a des places ?",opts:["È tutto esaurito?","Ci sono posti disponibili?","A che ora inizia?","Due biglietti?"],a:1},
        {q:"Que signifie 'un affresco' ?",opts:["Un tableau","Une sculpture","Une fresque","Un palais"],a:2},
      ]},
    p3:{
      id:"bonus", emoji:"🏛️", title:"Histoire & Monuments",
      subtitle:"Patrimoine, visites et organisation", color:"#2E7D32", light:"#F0FFF2",
      lessons:[
        {id:0, type:"phrases", title:"Visiter les monuments 🏛️",
          intro:"L'Italie est un musée à ciel ouvert !",
          items:[
            {fr:"À quelle heure ouvre-t-il ?", it:"A che ora apre?",           pr:"a ké O-ra A-pré"},
            {fr:"Y a-t-il une visite guidée ?", it:"C'è una visita guidata?",   pr:"tshè ou-na VI-zi-ta goui-DA-ta"},
            {fr:"C'est de quelle époque ?",     it:"Di che epoca è?",           pr:"di ké É-po-ka è"},
            {fr:"Qui a construit ça ?",         it:"Chi ha costruito questo?",  pr:"ki a kos-trou-I-to KOUÉS-to"},
            {fr:"C'est classé UNESCO ?",        it:"È patrimonio dell'UNESCO?", pr:"è pa-tri-MO-nio dèl-lou-NÈS-ko"},
          ]},
        {id:1, type:"phrases", title:"Organisation & Réservations 📋",
          intro:"Pour tout planifier comme un pro !",
          items:[
            {fr:"Je voudrais réserver",         it:"Vorrei prenotare",           pr:"vor-RÉI pré-no-TA-ré"},
            {fr:"C'est complet pour ce soir ?", it:"È al completo stasera?",     pr:"è al kom-PLÉ-to sta-SÉ-ra"},
            {fr:"Annuler la réservation",       it:"Cancellare la prenotazione", pr:"kan-tshèl-LA-ré la pré-no-ta-TSIO-né"},
            {fr:"Où est le bureau de change ?", it:"Dov'è il cambio?",           pr:"do-VÈ il KAM-bio"},
            {fr:"Y a-t-il du WiFi ici ?",       it:"C'è il WiFi qui?",           pr:"tshè il ouai-fai koui"},
          ]},
        {id:2, type:"phrases", title:"Urgences pratiques 🆘",
          intro:"Les phrases qu'on espère ne jamais utiliser…",
          items:[
            {fr:"Mon téléphone est mort",      it:"Il mio telefono è scarico",  pr:"il MIO té-LÈ-fo-no è SKA-ri-ko"},
            {fr:"Où est un distributeur ?",    it:"Dov'è un bancomat?",         pr:"do-VÈ oun ban-ko-MAT"},
            {fr:"J'ai perdu mon portefeuille", it:"Ho perso il portafoglio",    pr:"o PÈR-zo il por-ta-FO-lio"},
            {fr:"L'ambassade de France",       it:"L'ambasciata di Francia",    pr:"lam-ba-SHA-ta di FRAN-tsha"},
            {fr:"J'ai besoin d'aide",          it:"Ho bisogno di aiuto",        pr:"o bi-ZO-nio di a-IOU-to"},
          ]},
        {id:3, type:"grammar", title:"Vocabulaire historique 🏺",
          intro:"Pour parler de l'histoire et du patrimoine !",
          tip:"💡 'Secolo' = siècle. 'Il quindicesimo secolo' = le XVe siècle !",
          items:[
            {fr:"Un siècle",       it:"Un secolo",       pr:"oun SÉ-ko-lo"},
            {fr:"Le Moyen-Âge",    it:"Il Medioevo",     pr:"il mé-dio-É-vo"},
            {fr:"La Renaissance",  it:"Il Rinascimento", pr:"il ri-na-shi-MÈN-to"},
            {fr:"L'Empire romain", it:"L'Impero romano", pr:"lim-PÉ-ro ro-MA-no"},
            {fr:"Un château fort", it:"Un castello",     pr:"oun kas-TÈL-lo"},
            {fr:"Des ruines",      it:"Delle rovine",    pr:"DÈL-lé ro-VI-né"},
          ]},
      ],
      quiz:[
        {q:"Comment demander s'il y a une visite guidée ?",opts:["A che ora apre?","Di che epoca è?","C'è una visita guidata?","Chi ha costruito questo?"],a:2},
        {q:"Comment dire 'Le Moyen-Âge' ?",opts:["Il Rinascimento","Il Medioevo","Il Barocco","L'Impero"],a:1},
        {q:"Que signifie 'Ho perso il portafoglio' ?",opts:["J'ai perdu mon passeport","J'ai perdu mon téléphone","J'ai perdu mon portefeuille","J'ai perdu ma clé"],a:2},
        {q:"Comment dire 'Je voudrais réserver' ?",opts:["Vorrei prenotare","Posso pagare?","Vorrei annullare","Ho una prenotazione"],a:0},
        {q:"Que signifie 'un castello' ?",opts:["Un temple","Une cathédrale","Un château fort","Un palais"],a:2},
      ]},
  };
  const NUMBERS_THEME = {
    id:"chiffres", emoji:"🔢", title:"Chiffres, Dates & Distances",
    subtitle:"Compter, se repérer dans le temps et l'espace", color:"#0277BD", light:"#E3F2FD",
    lessons:[
      {id:0, type:"phrases", title:"Les chiffres en pratique",
        intro:"En Italie, on marchande, on commande, on compte !",
        items:[
          {fr:"Combien ça coûte ?",      it:"Quanto costa?",       pr:"KOUAN-to KOS-ta"},
          {fr:"C'est combien en tout ?", it:"Quant'è in tutto?",   pr:"koan-TÈ in TOUT-to"},
          {fr:"Cinq euros",              it:"Cinque euro",         pr:"THIN-koué EU-ro"},
          {fr:"À quelle heure ?",        it:"A che ora?",          pr:"a ké O-ra"},
          {fr:"Il est midi",             it:"È mezzogiorno",       pr:"è mèd-dzo-DJOR-no"},
        ]},
      {id:1, type:"phrases", title:"Jours, mois & dates",
        intro:"Pour parler de quand, prendre rendez-vous, lire les horaires !",
        items:[
          {fr:"Aujourd'hui",          it:"Oggi",               pr:"OD-dji"},
          {fr:"Demain",               it:"Domani",             pr:"do-MA-ni"},
          {fr:"Hier",                 it:"Ieri",               pr:"IÉ-ri"},
          {fr:"Quelle est la date ?", it:"Che data è oggi?",   pr:"ké DA-ta è OD-dji"},
          {fr:"Le 15 août",           it:"Il quindici agosto", pr:"il KOUIN-di-tshi a-GOS-to"},
        ]},
      {id:2, type:"phrases", title:"Distances & orientations",
        intro:"Pour savoir si c'est loin, combien de temps, dans quelle direction !",
        items:[
          {fr:"C'est à combien de km ?", it:"A quanti chilometri è?", pr:"a KOUAN-ti ki-LO-mé-tri è"},
          {fr:"C'est à 10 minutes",      it:"È a dieci minuti",       pr:"è a DIÉ-tshi mi-NOU-ti"},
          {fr:"À pied ou en voiture ?",  it:"A piedi o in macchina?", pr:"a PIÉ-di o in MAK-ki-na"},
          {fr:"C'est près d'ici",        it:"È vicino da qui",        pr:"è vi-TSHI-no da koui"},
          {fr:"C'est loin",              it:"È lontano",              pr:"è lon-TA-no"},
        ]},
      {id:3, type:"grammar", title:"Les chiffres de 1 à 1000",
        intro:"Les chiffres italiens ressemblent beaucoup au français !",
        tip:"💡 Les dizaines : venti (20), trenta (30), quaranta (40), cinquanta (50)…",
        items:[
          {fr:"1 → 5",  it:"Uno, due, tre, quattro, cinque",  pr:"OU-no, DOU-é, TRÉ, KOUAT-tro, THIN-koué"},
          {fr:"6 → 10", it:"Sei, sette, otto, nove, dieci",   pr:"SÉI, SÈT-té, OT-to, NO-vé, DIÉ-tshi"},
          {fr:"20",     it:"Venti",                           pr:"VÈN-ti"},
          {fr:"50",     it:"Cinquanta",                       pr:"tshink-KOUAN-ta"},
          {fr:"100",    it:"Cento",                           pr:"TSHÈN-to"},
          {fr:"1000",   it:"Mille",                           pr:"MIL-lé"},
        ]},
    ],
    quiz:[
      {q:"Comment demander le prix ?",opts:["Quanto costa?","Come stai?","Dove sei?","Che ora è?"],a:0},
      {q:"Que signifie 'domani' ?",opts:["Hier","Aujourd'hui","Demain","Ce soir"],a:2},
      {q:"Comment dire 'C'est à 10 minutes' ?",opts:["È a dieci ore","È a dieci minuti","È a dieci km","È a dieci metri"],a:1},
      {q:"Que signifie 'è lontano' ?",opts:["C'est proche","C'est à gauche","C'est loin","C'est gratuit"],a:2},
      {q:"Comment dit-on '100' en italien ?",opts:["Mille","Venti","Cento","Cinquanta"],a:2},
    ]
  };
  const QUIZ_SAL = [
    {q:"Comment dit-on 'Bonjour' (le matin) ?",opts:["Buonasera","Buongiorno","Ciao","Prego"],a:1},
    {q:"Que signifie 'Prego' ?",opts:["S'il vous plaît","Merci","De rien","Au revoir"],a:2},
    {q:"Comment dit-on 'Je m'appelle…' ?",opts:["Come ti chiami?","Piacere","Mi chiamo","Io sono"],a:2},
    {q:"Que signifie 'Arrivederci' ?",opts:["Bonsoir","Bonne nuit","Salut","Au revoir"],a:3},
    {q:"Comment dit-on 'Merci' ?",opts:["Scusi","Per favore","Grazie","Permesso"],a:2},
  ];
  const QUIZ_RES = {
    p1:[
      {q:"Comment demander l'addition ?",opts:["Un cornetto","Il conto, per favore","Un gelato","Dov'è il bagno"],a:1},
      {q:"Que signifie 'Ho fame' ?",opts:["J'ai soif","J'ai chaud","J'ai faim","J'ai peur"],a:2},
      {q:"Comment dire 'Je voudrais un dessert' ?",opts:["Vorrei un gelato","Vorrei un dolce","Voglio la pasta","Ho sete"],a:1},
      {q:"Que signifie 'È molto dolce' ?",opts:["C'est amer","C'est chaud","C'est très sucré","C'est frais"],a:2},
      {q:"Comment dit-on 'De rien' ?",opts:["Grazie","Per favore","Prego","Scusi"],a:2},
    ],
    p2:[
      {q:"Comment demander l'addition ?",opts:["Un caffè","Il conto, per favore","Un tavolo","Dov'è il bagno"],a:1},
      {q:"Comment dire 'Un verre de vin rouge' ?",opts:["Un bicchiere di vino rosso","Un caffè","Un succo","Un prosecco"],a:0},
      {q:"Que signifie 'Ho fame' ?",opts:["J'ai soif","J'ai chaud","J'ai faim","J'ai peur"],a:2},
      {q:"Comment dire 'La spécialité de la maison' ?",opts:["Il menù","La specialità della casa","Il piatto tipico","Il vino rosso"],a:1},
      {q:"Comment dit-on 'De rien' ?",opts:["Grazie","Per favore","Prego","Scusi"],a:2},
    ],
    p3:[
      {q:"Comment demander l'addition ?",opts:["Un caffè","Il conto, per favore","Un tavolo","Dov'è il bagno"],a:1},
      {q:"Comment dire 'le menu du jour' ?",opts:["Il piatto tipico","Il menù del giorno","La specialità","Il vino"],a:1},
      {q:"Que signifie 'Ho fame' ?",opts:["J'ai soif","J'ai chaud","J'ai faim","J'ai peur"],a:2},
      {q:"Comment dire 'une table en terrasse' ?",opts:["Un tavolo in terrazza","Un tavolo per due","Un tavolo con vista","Un posto"],a:0},
      {q:"Comment dit-on 'De rien' ?",opts:["Grazie","Per favore","Prego","Scusi"],a:2},
    ],
  };
  const QUIZ_TRA = [
    {q:"Comment dire 'Tout droit' ?",opts:["Giri a destra","Sempre dritto","Giri a sinistra","È lontano"],a:1},
    {q:"Que signifie 'Non capisco' ?",opts:["Je ne parle pas","Je ne comprends pas","Je ne vois pas","Je ne sais pas"],a:1},
    {q:"Que veut dire 'Quanto costa' ?",opts:["Où est-ce ?","C'est loin ?","Combien ça coûte ?","Quelle heure ?"],a:2},
    {q:"Comment dire 'Tournez à gauche' ?",opts:["Giri a destra","Sempre dritto","Giri a sinistra","È vicino"],a:2},
    {q:"Comment dire 'Nous allons' ?",opts:["Voi andate","Loro vanno","Noi andiamo","Tu vai"],a:2},
  ];
  const QUIZ_SHO = [
    {q:"Comment dire 'C'est trop cher' ?",opts:["È molto bello","È troppo caro","È un regalo","È fatto a mano"],a:1},
    {q:"Que signifie 'Lo prendo' ?",opts:["C'est cher","Je le prends","Je cherche","Je reviens"],a:1},
    {q:"Comment demander une réduction ?",opts:["C'è uno sconto?","Avete la taglia?","Posso provarlo?","Quanto costa?"],a:0},
    {q:"Que signifie 'Accettate le carte' ?",opts:["Avez-vous des soldes ?","Acceptez-vous les cartes ?","C'est fait à la main ?","Je cherche…"],a:1},
    {q:"Comment dire 'C'est un cadeau' ?",opts:["Torno domani","Cerco","È un regalo","Lo prendo"],a:2},
  ];
  const QUIZ_HOT = [
    {q:"Comment dire 'Au secours !' ?",opts:["Permesso!","Scusi!","Aiuto!","Pronto!"],a:2},
    {q:"Que signifie 'Ho perso' ?",opts:["J'ai trouvé","J'ai perdu","J'ai oublié","J'ai cassé"],a:1},
    {q:"Comment demander un médecin ?",opts:["Ho bisogno di un medico","Chiamate la polizia","Dov'è la farmacia","Ho una prenotazione"],a:0},
    {q:"Comment dire 'J'ai une réservation' ?",opts:["Ho una camera","Ho una prenotazione","Ho un biglietto","Ho un problema"],a:1},
    {q:"Comment dire 'Le WiFi fonctionne ?' ?",opts:["Dov'è l'ascensore?","Il WiFi funziona?","C'è la colazione?","A che ora?"],a:1},
  ];
  return [
    {id:"salutations", emoji:"👋", title:"Salutations",
      subtitle:"Dire bonjour, se présenter", color:"#E8622A", light:"#FFF0EB",
      lessons:[
        {id:0, type:"phrases", title:"Les premiers mots",      intro:"Les salutations indispensables pour commencer !", items:SAL_L1},
        {id:1, type:"phrases", title:"Se présenter",           intro:"Pour parler de toi et faire connaissance.",       items:SAL_L2},
        {id:2, type:"phrases", title:"Mots magiques",          intro:"Les mots qui ouvrent toutes les portes !",        items:SAL_L3},
        GRAM_ESSERE,
      ], quiz:QUIZ_SAL},
    {id:"restaurant", emoji:"🍕", title:"Café & Restaurant",
      subtitle:{p1:"Commander, se régaler et déguster !", p2:"Gastronomie, vins et spécialités locales", p3:"Commander, s'organiser et déguster"}[pid],
      color:"#C41E3A", light:"#FFF0F2",
      lessons:[
        {id:0, type:"phrases", title:"Au café",   intro:"L'Italie est la patrie du café et des petits-déjeuners !", items:RES_L1},
        {id:1, type:"phrases", title:{p1:"Desserts & Douceurs 🍰",p2:"Gastronomie & Vins 🍷",p3:"Commander & S'organiser 📋"}[pid],
          intro:{p1:"Pour Lola, la vraie question c'est : qu'est-ce qu'il y a comme dessert ?",p2:"Pour Fiona, manger en Italie c'est une expérience culturelle !",p3:"Pour Fabien, bien s'organiser au restaurant c'est aussi savoir voyager !"}[pid],
          items:RES_L2[pid]},
        {id:2, type:"phrases", title:"Questions pratiques", intro:"Des phrases utiles pour éviter les surprises !", items:RES_L3},
        GRAM_VOLERE,
      ], quiz:QUIZ_RES[pid]},
    {id:"transport", emoji:"🚆", title:"Transport & Directions",
      subtitle:{p1:"Se déplacer pour mieux explorer !", p2:"Rejoindre les musées et sites culturels", p3:"S'orienter et optimiser ses déplacements"}[pid],
      color:"#1B6BBE", light:"#EBF3FF",
      lessons:[
        {id:0, type:"phrases", title:{p1:"Gare & Billets",p2:"Billets & Musées",p3:"Gare & Billets pro"}[pid],
          intro:{p1:"L'Italie a un excellent réseau ferroviaire !",p2:"Pour relier sites culturels et villes d'art !",p3:"Maîtriser le réseau ferroviaire pour optimiser chaque trajet !"}[pid],
          items:TRA_L1[pid]},
        {id:1, type:"phrases", title:"Directions",  intro:"Pour ne pas se perdre dans les belles ruelles italiennes !", items:TRA_L2},
        {id:2, type:"phrases", title:"En ville",    intro:"Pour explorer la ville comme un local !",                    items:TRA_L3},
        GRAM_ANDARE,
      ], quiz:QUIZ_TRA},
    {id:"shopping", emoji:"🛍️", title:"Shopping",
      subtitle:{p1:"Marchés, gourmandises et petits achats", p2:"Librairies, galeries et boutiques", p3:"Acheter malin et trouver ce dont on a besoin"}[pid],
      color:"#2E8B57", light:"#EDFFF3",
      lessons:[
        {id:0, type:"phrases", title:"Dans le magasin", intro:"L'Italie, paradis du shopping !", items:SHO_L1},
        {id:1, type:"phrases", title:{p1:"Marché & Spécialités 🥦",p2:"Livres d'art & Boutiques 🖼️",p3:"Équipement & Pharmacie 💊"}[pid],
          intro:{p1:"Les marchés italiens regorgent de produits frais !",p2:"Les boutiques de musées italiennes sont incroyables !",p3:"Pour trouver tout ce dont on a besoin en voyage !"}[pid],
          items:SHO_L2[pid]},
        {id:2, type:"phrases", title:"Payer & Finaliser", intro:"Pour conclure ses achats sans stress !", items:SHO_L3},
        GRAM_AVERE_PASSE,
      ], quiz:QUIZ_SHO},
    {id:"hotel", emoji:"🏨", title:"Hôtel & Urgences",
      subtitle:"Se loger confortablement et faire face à l'imprévu", color:"#7B5EA7", light:"#F5F0FF",
      lessons:[
        {id:0, type:"phrases", title:"À l'hôtel",            intro:"Pour s'installer confortablement !",              items:HOT_L1},
        {id:1, type:"phrases", title:"Problèmes & Demandes", intro:"Pour gérer les imprévus sans stress !",           items:HOT_L2},
        {id:2, type:"phrases", title:"Urgences",             intro:"Phrases importantes pour ta sécurité !",         items:HOT_L3},
        GRAM_FUTUR,
      ], quiz:QUIZ_HOT},
    BONUS[pid],
    NUMBERS_THEME,
  ];
};
const DEFAULT_PROFILES = [
  { id:"p1", name:"Lola",   avatar:"🎀", scores:{}, total_score:0 },
  { id:"p2", name:"Fiona",  avatar:"🌸", scores:{}, total_score:0 },
  { id:"p3", name:"Fabien", avatar:"🗺️", scores:{}, total_score:0 },
];
const AVATARS = ["🎀","🌸","🗺️","🦁","🐯","🐻","🦊","🦄","🎨","🍕","🌟","✈️"];
const P_COLORS = { p1:"#E8622A", p2:"#C41E3A", p3:"#1B6BBE" };
const AKEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const claude = async (content, maxTokens=1500) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "x-api-key":AKEY,
      "anthropic-version":"2023-06-01",
      "anthropic-dangerous-direct-browser-access":"true"
    },
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:maxTokens,
      messages:[{role:"user",content}]
    })
  });
  const d = await res.json();
  return d.content[0].text.replace(/```json\n?|```/g,"").trim();
};

const genQuiz = async (title, lessons) => {
  const items = lessons.flatMap(l=>l.items||[]).slice(0,15);
  const vocab = items.map((i,n)=>`${n+1}. FR:"${i.fr}" IT:"${i.it}"`).join("\n");
  const prompt = `Quiz d'italien pour débutants. Thème:"${title}"\nVocabulaire de la leçon:\n${vocab}

Génère 5 questions de difficulté STRICTEMENT croissante basées sur ce vocabulaire.
Retourne UNIQUEMENT du JSON valide, sans aucun markdown:
{
  "questions":[
    {"type":"mcq_it","q":"Comment dit-on [mot FR] en italien ?","fr":"mot FR exact","options":["traduction IT correcte","mauvais1","mauvais2","mauvais3"],"correct":0},
    {"type":"mcq_fr","q":"Que signifie [mot IT] en français ?","it":"mot IT exact","options":["traduction FR correcte","mauvais1","mauvais2","mauvais3"],"correct":0},
    {"type":"fill_blank","q":"Complète la phrase italienne :","before":"début de phrase IT","blank":"MOT_MANQUANT","after":"fin de phrase IT","options":["MOT_MANQUANT","mauvais1","mauvais2","mauvais3"],"correct":0},
    {"type":"jigsaw","q":"Remets ces mots italiens dans le bon ordre :","words":["mot1","mot2","mot3","mot4","mot5"],"answer":"mot1 mot2 mot3 mot4 mot5"},
    {"type":"translate","q":"Traduis cette phrase entière en italien :","fr":"phrase française complète","answer":"traduction italienne complète","hint":"💡 indice grammatical utile"}
  ]
}`;
  const txt = await claude(prompt);
  const parsed = JSON.parse(txt);
  return parsed.questions;
};

const checkTranslation = async (fr, answer, input) => {
  const prompt = `Contexte: cours d'italien débutant.
Phrase française: "${fr}"
Traduction correcte attendue: "${answer}"
Réponse de l'élève: "${input}"
Évalue si c'est correct. Sois indulgent sur les accents manquants et petites fautes de frappe.
Retourne UNIQUEMENT ce JSON: {"correct":true,"feedback":"message encourageant"} ou {"correct":false,"feedback":"correction courte"}`;
  const txt = await claude(prompt, 200);
  return JSON.parse(txt);
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;800&family=Nunito:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  .fc{perspective:700px;cursor:pointer;}
  .fi{transition:transform .45s cubic-bezier(.4,.2,.2,1);transform-style:preserve-3d;position:relative;}
  .fi.on{transform:rotateY(180deg);}
  .ff{position:absolute;width:100%;height:100%;backface-visibility:hidden;-webkit-backface-visibility:hidden;}
  .fb{transform:rotateY(180deg);}
  @keyframes popIn{0%{opacity:0;transform:scale(.88) translateY(10px)}100%{opacity:1;transform:scale(1) translateY(0)}}
  .pop{animation:popIn .3s ease both;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  .fadeUp{animation:fadeUp .32s ease both;}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  .opt{transition:all .12s;cursor:pointer;}
  .opt:active{transform:scale(.97);}
  .tap:active{opacity:.7;}
  input,textarea{font-family:'Nunito',sans-serif;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-thumb{background:#ddd;border-radius:2px;}
`;

const FlagStripe = ()=>(
  <div style={{display:"flex",height:5,flexShrink:0}}>
    <div style={{flex:1,background:"#009246"}}/>
    <div style={{flex:1,background:"#fff",borderTop:"1px solid #eee",borderBottom:"1px solid #eee"}}/>
    <div style={{flex:1,background:"#CE2B37"}}/>
  </div>
);

function ProfileProgress({scores,color}){
  const keys=makeThemes("p1");
  const done=Object.keys(scores).length;
  const pct=(done/keys.length)*100;
  const avg=done>0?(Object.values(scores).reduce((a,b)=>a+b,0)/done).toFixed(1):null;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontSize:11,color:"#aaa",fontWeight:600}}>{done}/{keys.length} thèmes</span>
        {avg&&<span style={{fontSize:11,fontWeight:800,color}}>moy. {avg}/5</span>}
      </div>
      <div style={{height:6,background:"#F0ECE6",borderRadius:3,marginBottom:7}}>
        <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:3,transition:"width .4s"}}/>
      </div>
      <div style={{display:"flex",gap:4}}>
        {keys.map((t,i)=>{const s=scores[t.id];return <div key={i} style={{flex:1,textAlign:"center",fontSize:13}}>{s!==undefined?scoreEmoji(s):"·"}</div>;})}
      </div>
    </div>
  );
}

