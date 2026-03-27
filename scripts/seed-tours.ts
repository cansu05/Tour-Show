import { FieldValue } from "firebase-admin/firestore";
import { pathToFileURL } from "node:url";
import { adminDb } from "../lib/firebase/admin";
import type { TourDocument } from "../types/tour";
import { commitInBatches } from "./lib/firestore-batch";

const aquariumGallery = [
  "/images/aquarium/aquarium-1.webp",
  "/images/aquarium/aquarium-2.webp",
  "/images/aquarium/aquarium-3.webp",
  "/images/aquarium/aquarium-4.webp",
  "/images/aquarium/aquarium-5.webp",
  "/images/antalya/antalya-3.webp",
  "/images/antalya/antalya-4.webp",
  "/images/antalya/antalya-5.webp",
  "/images/kuyumcu.webp",
];

const antalyaGallery = [
  "/images/sandland/sandland-1.webp",
  "/images/sandland/sandland-2.webp",
  "/images/sandland/sandland-3.webp",
  "/images/sandland/sandland-4.webp",
  "/images/sandland/sandland-5.webp",
  "/images/sandland/sandland-6.webp",
  "/images/antalya/antalya-2.webp",
  "/images/antalya/antalya-3.webp",
  "/images/selale/selale-2.webp",
];

const baseTours: TourDocument[] = [
  {
    slug: "antalya-highlights",
    isActive: true,
    categories: ["city-tour", "sandland", "daily-tour"],
    hasTransfer: true,
    hasMeal: false,
    campaignPrice: 45,
    pricing: {
      currency: "EUR",
      byRegion: {
        kemer: { adultPrice: 49, childPrice: 25, availableDays: ["tuesday"] },
        antalyaBelek: {
          adultPrice: 49,
          childPrice: 25,
          availableDays: ["tuesday"],
        },
        sideManavgat: {
          adultPrice: 49,
          childPrice: 25,
          availableDays: ["saturday"],
        },
        alanya: { adultPrice: 49, childPrice: 25, availableDays: ["saturday"] },
      },
    },
    participantRules: {
      freeChildMinAge: 0,
      freeChildMaxAge: 4,
      childMinAge: 5,
      childMaxAge: 12,
    },
    coverImage: "/images/antalya/antalya-cover.webp",
    gallery: antalyaGallery,
    localized: {
      tr: {
        title: "Antalya One Cikanlar Turu",
        shortDescription:
          "Tekne turu, bazarda serbest zaman, Karpuzkaldiran Selalesi ve Sandland ziyareti sunan keyifli Antalya sehir turu.",
        description:
          "Antalya Highlights Turu ile sehrin one cikan noktalarini keyifli ve dolu dolu bir programla kesfedebilirsiniz. Program kapsaminda Antalya'da bulusma ve taki merkezi ziyareti sonrasi yat limaninda yaklasik 40 dakikalik tekne turu yapilir. Ardindan sehir merkezindeki bazarda yaklasik 2 saat serbest zaman verilir. Gunun devaminda Karpuzkaldiran Selalesi ziyaret edilir ve programa dahil olan Sandland gezisiyle tur tamamlanir. Antalya'yi hem gezmek hem de sehrin farkli duraklarini tek bir turda gormek isteyen misafirler icin ideal bir secenektir.",
        thingsToBring: [
          "Rahat ve hafif kiyafetler",
          "Gunes gozlugu",
          "Gunes sapkasi",
          "Fotograf makinesi",
        ],
        importantNotes: [
          "Yemek fiyata dahil degildir.",
          "Alisveris icin nakit veya kredi karti bulundurmaniz onerilir.",
          "Sandland ziyareti tur programina dahildir.",
        ],
      },
      ru: {
        title: "Glavnye mesta Antalii",
        shortDescription:
          "Prijatny gorodskoy tur s progulkoy na lodke, svobodnym vremenem na bazare, vodopadom Karpuzkaldiran i poseshcheniem Sandland.",
        description:
          "Tur po glavnym mestam Antalii pozvolyaet za odin den uvidet samye populyarnye tochki goroda. V programme est vstrecha v Antalii, poseshchenie yuvelirnogo tsentra, okolo 40 minut progulki na lodke, okolo 2 chasov svobodnogo vremeni na bazare, ostanovka u vodopada Karpuzkaldiran i vizit v Sandland.",
        thingsToBring: [
          "Udobnaya legkaya odezhda",
          "Solntsezashchitnye ochki",
          "Golovnoy ubor ot solntsa",
          "Fotoapparat",
        ],
        importantNotes: [
          "Pitanie ne vklyucheno.",
          "Rekomenduetsya vzyat nalichnye ili bankovskuyu kartu dlya pokupok.",
          "Poseshchenie Sandland vklyucheno v programmu.",
        ],
      },
      fr: {
        title: "Incontournables d Antalya",
        shortDescription:
          "Une agreable visite de la ville avec balade en bateau, temps libre au bazar, cascade de Karpuzkaldiran et visite de Sandland.",
        description:
          "Cette excursion permet de decouvrir en une journee plusieurs points forts d Antalya. Le programme comprend le rendez vous en ville, la visite d un centre de bijoux, environ 40 minutes de balade en bateau, pres de 2 heures de temps libre au bazar, un arret a la cascade de Karpuzkaldiran et la visite de Sandland.",
        thingsToBring: [
          "Vetements legers et confortables",
          "Lunettes de soleil",
          "Chapeau de soleil",
          "Appareil photo",
        ],
        importantNotes: [
          "Le repas n est pas inclus.",
          "Prevoyez des especes ou une carte pour les achats.",
          "La visite de Sandland est incluse dans le programme.",
        ],
      },
      sk: {
        title: "To najlepsie z Antalye",
        shortDescription:
          "Prijemny mestsky vylet s plavbou lodou, volnym casom na bazari, vodopadom Karpuzkaldiran a navstevou Sandlandu.",
        description:
          "Vylet po hlavnich miestach Antalye vam pocas jedneho dna ukaze najznamejsie zastavky mesta. Program zahrna stretnutie v Antalyi, navstevu klenotnickeho centra, priblizne 40 minut plavby lodou, asi 2 hodiny volneho casu na bazari, zastavku pri vodopade Karpuzkaldiran a navstevu Sandlandu.",
        thingsToBring: [
          "Pohodlne lahke oblecenie",
          "Slnecne okuliare",
          "Klobuk proti slnku",
          "Fotoaparat",
        ],
        importantNotes: [
          "Jedlo nie je zahrnute v cene.",
          "Na nakupy odporucame hotovost alebo kartu.",
          "Navsteva Sandlandu je sucastou programu.",
        ],
      },
      cs: {
        title: "To nejlepsi z Antalye",
        shortDescription:
          "Prijemny vylet po meste s plavbou lodi, volnym casem na bazaru, vodopadem Karpuzkaldiran a navstevou Sandlandu.",
        description:
          "Tento vylet ukaze behem jednoho dne nejoblibenejsi mista Antalye. Program zahrnuje setkani ve meste, navstevu klenotnickeho centra, asi 40 minut plavby lodi, priblizne 2 hodiny volneho casu na bazaru, zastavku u vodopadu Karpuzkaldiran a navstevu Sandlandu.",
        thingsToBring: [
          "Pohodlne lehke obleceni",
          "Slunecni bryle",
          "Klobouk proti slunci",
          "Fotoaparat",
        ],
        importantNotes: [
          "Jidlo neni zahrnuto v cene.",
          "Na nakupy doporucujeme hotovost nebo kartu.",
          "Navsteva Sandlandu je soucasti programu.",
        ],
      },
    },
  },
  {
    slug: "antalya-by-night",
    isActive: true,
    categories: ["city-tour", "evening-tour", "sandland"],
    hasTransfer: true,
    hasMeal: false,
    campaignPrice: 45,
    pricing: {
      currency: "EUR",
      byRegion: {
        kemer: { adultPrice: 49, childPrice: 25, availableDays: ["tuesday"] },
        antalyaBelek: {
          adultPrice: 49,
          childPrice: 25,
          availableDays: ["tuesday"],
        },
        sideManavgat: {
          adultPrice: 49,
          childPrice: 25,
          availableDays: ["saturday"],
        },
        alanya: { adultPrice: 49, childPrice: 25, availableDays: ["saturday"] },
      },
    },
    participantRules: {
      freeChildMinAge: 0,
      freeChildMaxAge: 4,
      childMinAge: 5,
      childMaxAge: 12,
    },
    coverImage: "/images/antalya/antalya-cover.webp",
    gallery: antalyaGallery,
    localized: {
      tr: {
        title: "Antalya Aksam Turu",
        shortDescription:
          "Tekne turu, bazarda yaklasik 2 saat serbest zaman, Karpuzkaldiran Selalesi ve Sandland ziyareti sunan keyifli aksam turu.",
        description:
          "Antalya By Night Turu ile sehri aksam atmosferinde kesfetme firsati yakalayabilirsiniz. Program kapsaminda Antalya'da bulusma ve taki merkezi ziyareti sonrasi yaklasik 45 dakikalik tekne turu yapilir. Ardindan bazarda yaklasik 2 saatlik serbest zaman verilir. Gunun devaminda Karpuzkaldiran Selalesi ziyaret edilir ve programa dahil olan Sandland gezisi ile tur tamamlanir. Antalya'da hem gezmek hem alisveris yapmak hem de aksam saatlerinde keyifli bir sehir turu deneyimi yasamak isteyen misafirler icin ideal bir secenektir.",
        thingsToBring: [
          "Rahat ve hafif kiyafetler",
          "Fotograf makinesi",
          "Gunes gozlugu",
          "Gunes sapkasi",
        ],
        importantNotes: [
          "Yemek fiyata dahil degildir.",
          "Alisveris icin nakit veya kredi karti bulundurmaniz onerilir.",
          "Sandland ziyareti tur programina dahildir.",
        ],
      },
      ru: {
        title: "Vechernyaya Antalya",
        shortDescription:
          "Ujutnyy vecherniy tur s progulkoy na lodke, svobodnym vremenem na bazare, vodopadom Karpuzkaldiran i Sandland.",
        description:
          "Vechernyaya Antalya pokazhet gorod v drugoy atmosfere. Posle vstrechi i ostanovki v yuvelirnom tsentre programa prodolzhaetsya okolo 45-minutnoy progulkoy na lodke, zatem sleduet okolo 2 chasov svobodnogo vremeni na bazare, poseshchenie vodopada Karpuzkaldiran i finalnyy vizit v Sandland.",
        thingsToBring: [
          "Udobnaya legkaya odezhda",
          "Fotoapparat",
          "Solntsezashchitnye ochki",
          "Golovnoy ubor ot solntsa",
        ],
        importantNotes: [
          "Pitanie ne vklyucheno.",
          "Rekomenduetsya vzyat nalichnye ili bankovskuyu kartu dlya pokupok.",
          "Poseshchenie Sandland vklyucheno v programmu.",
        ],
      },
      fr: {
        title: "Antalya by Night",
        shortDescription:
          "Une agreable excursion du soir avec balade en bateau, temps libre au bazar, cascade de Karpuzkaldiran et Sandland.",
        description:
          "Cette version en soiree permet de decouvrir Antalya dans une ambiance differente. Apres le rendez vous et la visite du centre de bijoux, le programme comprend environ 45 minutes de bateau, pres de 2 heures de temps libre au bazar, la cascade de Karpuzkaldiran et la visite de Sandland.",
        thingsToBring: [
          "Vetements legers et confortables",
          "Appareil photo",
          "Lunettes de soleil",
          "Chapeau de soleil",
        ],
        importantNotes: [
          "Le repas n est pas inclus.",
          "Prevoyez des especes ou une carte pour les achats.",
          "La visite de Sandland est incluse dans le programme.",
        ],
      },
      sk: {
        title: "Antalya vecer",
        shortDescription:
          "Prijemny vecerny vylet s plavbou lodou, volnym casom na bazari, vodopadom Karpuzkaldiran a Sandlandom.",
        description:
          "Vecerny vylet do Antalye vam ukaze mesto v inej atmosfere. Po stretnuti a navsteve klenotnickeho centra nasleduje asi 45 minut plavby lodou, priblizne 2 hodiny volneho casu na bazari, zastavka pri vodopade Karpuzkaldiran a navsteva Sandlandu.",
        thingsToBring: [
          "Pohodlne lahke oblecenie",
          "Fotoaparat",
          "Slnecne okuliare",
          "Klobuk proti slnku",
        ],
        importantNotes: [
          "Jedlo nie je zahrnute v cene.",
          "Na nakupy odporucame hotovost alebo kartu.",
          "Navsteva Sandlandu je sucastou programu.",
        ],
      },
      cs: {
        title: "Antalya vecer",
        shortDescription:
          "Prijemny vecerni vylet s plavbou lodi, volnym casem na bazaru, vodopadem Karpuzkaldiran a Sandlandem.",
        description:
          "Vecerni Antalya ukaze mesto v jine atmosfere. Po setkani a navsteve klenotnickeho centra nasleduje asi 45 minut plavby lodi, priblizne 2 hodiny volneho casu na bazaru, zastavka u vodopadu Karpuzkaldiran a navsteva Sandlandu.",
        thingsToBring: [
          "Pohodlne lehke obleceni",
          "Fotoaparat",
          "Slunecni bryle",
          "Klobouk proti slunci",
        ],
        importantNotes: [
          "Jidlo neni zahrnuto v cene.",
          "Na nakupy doporucujeme hotovost nebo kartu.",
          "Navsteva Sandlandu je soucasti programu.",
        ],
      },
    },
  },
  {
    slug: "aquarium-antalya",
    isActive: true,
    categories: ["city-tour", "aquarium", "daily-tour"],
    hasTransfer: true,
    hasMeal: false,
    campaignPrice: 59,
    pricing: {
      currency: "EUR",
      byRegion: {
        kemer: { adultPrice: 74, childPrice: 50, availableDays: ["wednesday"] },
        antalyaBelek: {
          adultPrice: 74,
          childPrice: 50,
          availableDays: ["wednesday"],
        },
        sideManavgat: {
          adultPrice: 74,
          childPrice: 50,
          availableDays: ["wednesday"],
        },
        alanya: {
          adultPrice: 74,
          childPrice: 50,
          availableDays: ["wednesday"],
        },
      },
    },
    participantRules: {
      freeChildMinAge: 0,
      freeChildMaxAge: 3,
      childMinAge: 4,
      childMaxAge: 12,
    },
    coverImage: "/images/aquarium/aquarium-cover.webp",
    gallery: aquariumGallery,
    localized: {
      tr: {
        title: "Akvaryum ve Antalya Turu",
        shortDescription:
          "Akvaryum ziyareti ve Antalya sehir merkezinde yaklasik 2 saat serbest zaman sunan keyifli günlük tur.",
        description:
          "Akvaryum ve Antalya Turu ile hem Antalya sehir atmosferini kesfedebilir hem de etkileyici akvaryum deneyimini yasayabilirsiniz. Program kapsaminda Antalyada bulusma sonrasi taki merkezi ziyareti yapilir, ardindan yaklasik 1,5 saatlik akvaryum gezisi ile deniz alti dunyasinin buyuleyici atmosferi kesfedilir. Gunun devaminda Antalya sehir merkezindeki carsida yaklasik 2 saatlik serbest zaman verilir.",
        thingsToBring: [
          "Rahat ve hafif kiyafetler",
          "Fotograf makinesi",
          "Gunes gozlugu",
          "Gunes sapkasi",
        ],
        importantNotes: [
          "Yemek fiyata dahil degildir.",
          "Alisveris icin nakit veya kredi karti bulundurmaniz onerilir.",
        ],
      },
      ru: {
        title: "Akvaryum i Antalya",
        shortDescription:
          "Dnevnoy tur s poseshcheniem akvariuma i primerno 2 chasami svobodnogo vremeni v tsentre Antalii.",
        description:
          "Etot tur sochetaet atmosferu Antalii i vpechatlyayushchiy akvarium. Posle vstrechi i korotkoy ostanovki v tsentre ukrasheniy programma prodolzhaetsya primerno 1.5-chasovym poseshcheniem akvariuma, a zatem gosti poluchayut okolo 2 chasov svobodnogo vremeni v tsentre goroda.",
        thingsToBring: [
          "Udobnaya legkaya odezhda",
          "Fotoapparat",
          "Solntsezashchitnye ochki",
          "Golovnoy ubor ot solntsa",
        ],
        importantNotes: [
          "Pitanie ne vklyucheno.",
          "Rekomenduetsya vzyat nalichnye ili bankovskuyu kartu dlya pokupok.",
        ],
      },
      fr: {
        title: "Aquarium et Antalya",
        shortDescription:
          "Excursion de jour avec visite de l aquarium et environ 2 heures de temps libre dans le centre d Antalya.",
        description:
          "Cette excursion combine l ambiance d Antalya et l experience impressionnante de l aquarium. Apres le rendez vous et un arret dans un centre de bijoux, le programme comprend environ 1 h 30 de visite de l aquarium puis pres de 2 heures de temps libre dans le centre ville.",
        thingsToBring: [
          "Vetements legers et confortables",
          "Appareil photo",
          "Lunettes de soleil",
          "Chapeau de soleil",
        ],
        importantNotes: [
          "Le repas n est pas inclus.",
          "Prevoyez des especes ou une carte pour les achats.",
        ],
      },
      sk: {
        title: "Akvaryum a Antalya",
        shortDescription:
          "Denny vylet s navstevou akvaria a priblizne 2 hodinami volneho casu v centre Antalye.",
        description:
          "Tento vylet spaja atmosferu Antalye s posobivym zazitkom z akvaria. Po stretnuti a kratkej navsteve klenotnickeho centra nasleduje asi 1,5 hodinova navsteva akvaria a potom priblizne 2 hodiny volneho casu v centre mesta.",
        thingsToBring: [
          "Pohodlne lahke oblecenie",
          "Fotoaparat",
          "Slnecne okuliare",
          "Klobuk proti slnku",
        ],
        importantNotes: [
          "Jedlo nie je zahrnute v cene.",
          "Na nakupy odporucame hotovost alebo kartu.",
        ],
      },
      cs: {
        title: "Akvaryum a Antalya",
        shortDescription:
          "Jednodenni vylet s navstevou akvaria a priblizne 2 hodinami volneho casu v centru Antalye.",
        description:
          "Tento vylet spojuje atmosferu Antalye s pusobivym zazitkem z akvaria. Po setkani a kratke navsteve klenotnickeho centra nasleduje asi 1,5 hodiny v akvariu a pote priblizne 2 hodiny volneho casu v centru mesta.",
        thingsToBring: [
          "Pohodlne lehke obleceni",
          "Fotoaparat",
          "Slunecni bryle",
          "Klobouk proti slunci",
        ],
        importantNotes: [
          "Jidlo neni zahrnuto v cene.",
          "Na nakupy doporucujeme hotovost nebo kartu.",
        ],
      },
    },
  },
  {
    slug: "aquarium-antalya-evening",
    isActive: true,
    categories: ["city-tour", "aquarium", "evening-tour"],
    hasTransfer: true,
    hasMeal: false,
    campaignPrice: 59,
    pricing: {
      currency: "EUR",
      byRegion: {
        kemer: { adultPrice: 74, childPrice: 50, availableDays: ["wednesday"] },
        antalyaBelek: {
          adultPrice: 74,
          childPrice: 50,
          availableDays: ["wednesday"],
        },
        sideManavgat: {
          adultPrice: 74,
          childPrice: 50,
          availableDays: ["wednesday"],
        },
        alanya: {
          adultPrice: 74,
          childPrice: 50,
          availableDays: ["wednesday"],
        },
      },
    },
    participantRules: {
      freeChildMinAge: 0,
      freeChildMaxAge: 3,
      childMinAge: 4,
      childMaxAge: 12,
    },
    coverImage: "/images/aquarium/aquarium-cover.webp",
    gallery: aquariumGallery,
    localized: {
      tr: {
        title: "Akvaryum ve Antalya Aksam Turu",
        shortDescription:
          "Antalya sehir merkezinde yaklasik 2 saat serbest zaman ve akvaryum ziyareti sunan keyifli aksam turu.",
        description:
          "Akvaryum ve Antalya Aksam Turu ile gunun ilerleyen saatlerinde Antalyayi farkli bir atmosferde kesfedebilirsiniz. Program kapsaminda Antalyada bulusma sonrasi taki merkezi ziyareti yapilir, sehir merkezindeki carsida yaklasik 2 saatlik serbest zaman verilir ve ardindan yaklasik 1,5 saat suren akvaryum gezisi gerceklestirilir.",
        thingsToBring: [
          "Rahat ve hafif kiyafetler",
          "Fotograf makinesi",
          "Gunes gozlugu",
          "Gunes sapkasi",
        ],
        importantNotes: [
          "Yemek fiyata dahil degildir.",
          "Alisveris icin nakit veya kredi karti bulundurmaniz onerilir.",
        ],
      },
      ru: {
        title: "Akvaryum i vechernyaya Antalya",
        shortDescription:
          "Vecherniy tur s okolo 2 chasami svobodnogo vremeni v tsentre Antalii i poseshcheniem akvariuma.",
        description:
          "V etoy programme Antalya raskryvaetsya v vechernie chasy. Posle vstrechi i poseshcheniya tsentra ukrasheniy gosti poluchayut okolo 2 chasov svobodnogo vremeni v tsentre, a zatem otpravlyayutsya na primerno 1.5-chasovoe poseshchenie akvariuma.",
        thingsToBring: [
          "Udobnaya legkaya odezhda",
          "Fotoapparat",
          "Solntsezashchitnye ochki",
          "Golovnoy ubor ot solntsa",
        ],
        importantNotes: [
          "Pitanie ne vklyucheno.",
          "Rekomenduetsya vzyat nalichnye ili bankovskuyu kartu dlya pokupok.",
        ],
      },
      fr: {
        title: "Aquarium et Antalya le soir",
        shortDescription:
          "Excursion du soir avec environ 2 heures de temps libre dans le centre d Antalya et visite de l aquarium.",
        description:
          "Cette formule permet de decouvrir Antalya plus tard dans la journee. Apres le rendez vous et la visite d un centre de bijoux, les participants profitent d environ 2 heures de temps libre en ville puis visitent l aquarium pendant environ 1 h 30.",
        thingsToBring: [
          "Vetements legers et confortables",
          "Appareil photo",
          "Lunettes de soleil",
          "Chapeau de soleil",
        ],
        importantNotes: [
          "Le repas n est pas inclus.",
          "Prevoyez des especes ou une carte pour les achats.",
        ],
      },
      sk: {
        title: "Akvaryum a Antalya vecer",
        shortDescription:
          "Vecerny vylet s priblizne 2 hodinami volneho casu v centre Antalye a navstevou akvaria.",
        description:
          "Tata verzia programu ukazuje Antalyu vo vecernych hodinach. Po stretnuti a navsteve klenotnickeho centra maju hostia asi 2 hodiny volneho casu v meste a potom nasleduje priblizne 1,5 hodinova navsteva akvaria.",
        thingsToBring: [
          "Pohodlne lahke oblecenie",
          "Fotoaparat",
          "Slnecne okuliare",
          "Klobuk proti slnku",
        ],
        importantNotes: [
          "Jedlo nie je zahrnute v cene.",
          "Na nakupy odporucame hotovost alebo kartu.",
        ],
      },
      cs: {
        title: "Akvaryum a Antalya vecer",
        shortDescription:
          "Vecerni vylet s priblizne 2 hodinami volneho casu v centru Antalye a navstevou akvaria.",
        description:
          "Tato varianta ukazuje Antalyi ve vecernich hodinach. Po setkani a navsteve klenotnickeho centra maji hoste asi 2 hodiny volneho casu ve meste a pote nasleduje priblizne 1,5hodinova navsteva akvaria.",
        thingsToBring: [
          "Pohodlne lehke obleceni",
          "Fotoaparat",
          "Slunecni bryle",
          "Klobouk proti slunci",
        ],
        importantNotes: [
          "Jidlo neni zahrnuto v cene.",
          "Na nakupy doporucujeme hotovost nebo kartu.",
        ],
      },
    },
  },
  {
    slug: "buggy-safari",
    isActive: true,
    categories: ["adventure", "safari", "daily-tour"],
    hasTransfer: true,
    hasMeal: false,
    campaignPrice: null,
    pricing: {
      currency: "EUR",
      byRegion: {
        kemer: { adultPrice: null, childPrice: null, availableDays: [] },
        antalyaBelek: {
          adultPrice: 65,
          childPrice: null,
          availableDays: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ],
        },
        sideManavgat: {
          adultPrice: 60,
          childPrice: null,
          availableDays: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
        },
        alanya: {
          adultPrice: 60,
          childPrice: null,
          availableDays: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
        },
      },
    },
    participantRules: {
      freeChildMinAge: null,
      freeChildMaxAge: null,
      childMinAge: null,
      childMaxAge: null,
    },
    coverImage: "/images/tours/buggy-safari/buggy-safari-cover.webp",
    gallery: [],
    videoUrl: "/images/tours/buggy-safari/buggy-safari.mp4",
    localized: {
      tr: {
        title: "Buggy Safari Turu",
        shortDescription:
          "Doga icinde yaklasik 1 saat 45 dakikalik surus sunan, adrenalin dolu buggy safari deneyimi.",
        description:
          "Buggy Safari Turu ile tatilinize heyecan ve macera katabilirsiniz. Otelden alinis ile baslayan programda safari alanina gecilir, kisa deneme surusunun ardindan doga icinde yaklasik 1 saat 45 dakikalik buggy safari deneyimi yasanir.",
        thingsToBring: [
          "Rahat ve hafif kiyafetler",
          "Fotograf makinesi",
          "Ekstra harcamalar icin nakit",
        ],
        importantNotes: [
          "Yemek fiyata dahil degildir.",
          "Koruyucu gozluk ekstra ucrete tabidir.",
          "Agiz bandi ekstra ucrete tabidir.",
          "Icecekler ekstra ucrete tabidir.",
          "17 yas ve uzeri katilimcilar icin 2. kisi fiyati 25 EUR olarak belirtilmistir.",
        ],
      },
      ru: {
        title: "Buggy Safari",
        shortDescription:
          "Adrenalinovoe priklyuchenie s zaezdom na buggy po prirode prodolzhitelnostyu okolo 1 chasa 45 minut.",
        description:
          "Program nachinaetsya s transferta iz otyelya i prodolzhaetsya pereezdom v zonu safari. Posle korotkogo testovogo zaezda uchastnikov zhdet primerno 1 chas 45 minut po pyl nym i veselym marshrutam na buggy.",
        thingsToBring: [
          "Udobnaya legkaya odezhda",
          "Fotoapparat",
          "Nalichnye na dopolnitelnye rashody",
        ],
        importantNotes: [
          "Pitanie ne vklyucheno.",
          "Zashchitnye ochki oplachivayutsya dopolnitelno.",
          "Bandana oplachivaetsya dopolnitelno.",
          "Napitki oplachivayutsya dopolnitelno.",
          "Dlya uchastnikov ot 17 let stoimost vtorogo mesta ukazana kak 25 EUR.",
        ],
      },
      fr: {
        title: "Safari Buggy",
        shortDescription:
          "Une experience buggy riche en adrenaline avec environ 1 h 45 de conduite dans la nature.",
        description:
          "Le programme commence par la prise en charge a l hotel puis le transfert vers la zone du safari. Apres un court essai, les participants profitent d environ 1 h 45 de conduite sur des pistes poussiereuses et ludiques.",
        thingsToBring: [
          "Vetements legers et confortables",
          "Appareil photo",
          "Especes pour les depenses supplementaires",
        ],
        importantNotes: [
          "Le repas n est pas inclus.",
          "Les lunettes de protection sont en supplement.",
          "Le bandana est en supplement.",
          "Les boissons sont en supplement.",
          "Pour les participants de 17 ans et plus, le prix de la seconde personne est indique a 25 EUR.",
        ],
      },
      sk: {
        title: "Buggy safari",
        shortDescription:
          "Adrenalinovy zazitok s jazdou na buggy v prirode v trvani priblizne 1 hodina 45 minut.",
        description:
          "Program zacina vyzdvihnutim v hoteli a presunom do safari arealu. Po kratkej skusobnej jazde nasleduje asi 1 hodina 45 minut na prasnych a zabavnych tratiach.",
        thingsToBring: [
          "Pohodlne lahke oblecenie",
          "Fotoaparat",
          "Hotovost na dalsie vydavky",
        ],
        importantNotes: [
          "Jedlo nie je zahrnute v cene.",
          "Ochranne okuliare su za priplatok.",
          "Satka na usta je za priplatok.",
          "Napoje su za priplatok.",
          "Pre ucastnikov od 17 rokov je cena druhej osoby 25 EUR.",
        ],
      },
      cs: {
        title: "Buggy safari",
        shortDescription:
          "Adrenalinovy zazitek s jizdou na buggy v prirode v delce priblizne 1 hodina 45 minut.",
        description:
          "Program zacina vyzvednutim v hotelu a prejezdem do safari arealu. Po kratke zkusebni jizde nasleduje asi 1 hodina 45 minut na prasnych a zabavnych tratich.",
        thingsToBring: [
          "Pohodlne lehke obleceni",
          "Fotoaparat",
          "Hotovost na dalsi vydaje",
        ],
        importantNotes: [
          "Jidlo neni zahrnuto v cene.",
          "Ochranne bryle jsou za priplatek.",
          "Satek na usta je za priplatek.",
          "Napoje jsou za priplatek.",
          "Pro ucastniky od 17 let je cena druhe osoby 25 EUR.",
        ],
      },
    },
  },
  {
    slug: "antalya-4u-1-arada-macera-turu",
    isActive: true,
    categories: ["adventure", "nature", "daily-tour"],
    hasTransfer: true,
    hasMeal: true,
    campaignPrice: null,
    pricing: {
      currency: "EUR",
      byRegion: {
        kemer: {
          adultPrice: 84,
          childPrice: 45,
          availableDays: ["wednesday", "saturday"],
        },
        antalyaBelek: {
          adultPrice: 84,
          childPrice: 45,
          availableDays: ["tuesday", "thursday", "saturday"],
        },
        sideManavgat: {
          adultPrice: 84,
          childPrice: 45,
          availableDays: ["tuesday", "thursday", "saturday"],
        },
        alanya: {
          adultPrice: 84,
          childPrice: 45,
          availableDays: ["tuesday", "thursday", "saturday"],
        },
      },
    },
    participantRules: {
      freeChildMinAge: null,
      freeChildMaxAge: null,
      childMinAge: 6,
      childMaxAge: 12,
    },
    coverImage: "/images/four-in-one/4-in-1-cover.webp",
    gallery: [],
    videoUrl: "/images/four-in-one/4-in-1.mp4",
    localized: {
      tr: {
        title: "Antalya 4'u 1 Arada Macera Turu",
        shortDescription:
          "Buggy, mini zipline, monster truck, rafting ve ringo deneyimlerini bir araya getiren aksiyon dolu Antalya turu.",
        description:
          "Antalya 4'u 1 Arada Macera Turu ile tek bir gunde adrenalin, doga ve eglenceyi bir arada yasayin. Gun, otelden konforlu transfer ile baslar; ardindan etkileyici Tazi Kanyonu ve tarihi Roma Koprusu ziyaretiyle essiz manzaralarin tadini cikarirsiniz. Sonrasinda buggy surusu, mini zipline, monster truck deneyimi, rafting ve ringo gibi heyecan dolu aktivitelerle gun boyu enerjiniz hic dusmez.",
        thingsToBring: [
          "Rahat ve hafif kiyafetler",
          "Gunes gozlugu",
          "Gunes sapkasi",
          "Mayo veya uygun su kiyafeti",
          "Havlu",
          "Suya uygun ayakkabi",
          "Fotograf makinesi",
        ],
        importantNotes: [
          "Ekstra harcamalar icin nakit bulundurmaniz onerilir.",
        ],
      },
      ru: {
        title: "Priklyuchenie 4 v 1 v Antalii",
        shortDescription:
          "Aktivnyy tur, obedinyayushchiy buggy, mini zipline, monster truck, rafting i ringo v odnom dne.",
        description:
          "Etot marshrut sobiraet priklyuchenie, prirodu i razvlechenie v odnom dne. Posle transferta iz otyelya gosti uvidyat kanon Tazi i istoricheskiy rimskiy most, a zatem pereydut k buggy, mini zipline, poezdke na monster truck, raftingu i ringo. Obed vklyuchen v programmu.",
        thingsToBring: [
          "Udobnaya legkaya odezhda",
          "Solntsezashchitnye ochki",
          "Golovnoy ubor ot solntsa",
          "Kupalnik ili odezhda dlya vody",
          "Polotentse",
          "Obuv dlya vody",
          "Fotoapparat",
        ],
        importantNotes: [
          "Rekomenduetsya vzyat nalichnye na dopolnitelnye rashody.",
        ],
      },
      fr: {
        title: "Aventure 4 en 1 a Antalya",
        shortDescription:
          "Un tour plein d action qui reunit buggy, mini tyrolienne, monster truck, rafting et ringo dans une seule journee.",
        description:
          "Cette excursion rassemble aventure, nature et divertissement sur une seule journee. Apres le transfert depuis l hotel, les participants visitent le canyon de Tazi et le pont romain historique, puis profitent du buggy, de la mini tyrolienne, du monster truck, du rafting et du ringo. Le dejeuner est inclus.",
        thingsToBring: [
          "Vetements legers et confortables",
          "Lunettes de soleil",
          "Chapeau de soleil",
          "Maillot ou tenue adaptee a l eau",
          "Serviette",
          "Chaussures pour l eau",
          "Appareil photo",
        ],
        importantNotes: [
          "Nous recommandons de prevoir des especes pour les depenses supplementaires.",
        ],
      },
      sk: {
        title: "Antalya 4 v 1 dobrodruzstvo",
        shortDescription:
          "Akcny vylet, ktory spaja buggy, mini zipline, monster truck, rafting a ringo do jedneho dna.",
        description:
          "Tento program spaja dobrodruzstvo, prirodu a zabavu do jedineho dna. Po transfere z hotela hostia navstivia kanon Tazi a historicky rimsky most, potom si uziju buggy, mini zipline, monster truck, rafting aj ringo. Obed je v cene.",
        thingsToBring: [
          "Pohodlne lahke oblecenie",
          "Slnecne okuliare",
          "Klobuk proti slnku",
          "Plavky alebo oblecenie do vody",
          "Uterak",
          "Topanky do vody",
          "Fotoaparat",
        ],
        importantNotes: ["Odporucame zobrat hotovost na dalsie vydavky."],
      },
      cs: {
        title: "Antalya 4 v 1 dobrodruzstvi",
        shortDescription:
          "Akcni vylet, ktery spojuje buggy, mini zipline, monster truck, rafting a ringo do jednoho dne.",
        description:
          "Tento program spojuje dobrodruzstvi, prirodu a zabavu v jednom dni. Po transferu z hotelu hoste navstivi kanon Tazi a historicky rimsky most, pote si uziji buggy, mini zipline, monster truck, rafting i ringo. Obed je zahrnut v cene.",
        thingsToBring: [
          "Pohodlne lehke obleceni",
          "Slunecni bryle",
          "Klobouk proti slunci",
          "Plavky nebo obleceni do vody",
          "Rucnik",
          "Boty do vody",
          "Fotoaparat",
        ],
        importantNotes: ["Doporucujeme vzit si hotovost na dalsi vydaje."],
      },
    },
  },
];

const localeOverrides: Record<
  string,
  NonNullable<TourDocument["localized"]>
> = {
  "antalya-highlights": {
    tr: {
      title: "Antalya Öne Çıkanlar Turu",
      shortDescription:
        "Tekne turu, bazarda serbest zaman, Karpuzkaldıran Şelalesi ve Sandland ziyareti sunan keyifli Antalya şehir turu.",
      description:
        "Antalya Highlights Turu ile şehrin öne çıkan noktalarını keyifli ve dolu dolu bir programla keşfedebilirsiniz. Program kapsamında Antalya'da buluşma ve takı merkezi ziyareti sonrası yat limanında yaklaşık 40 dakikalık tekne turu yapılır. Ardından şehir merkezindeki bazarda yaklaşık 2 saat serbest zaman verilir. Günün devamında Karpuzkaldıran Şelalesi ziyaret edilir ve programa dahil olan Sandland gezisiyle tur tamamlanır. Antalya'yı hem gezmek hem de şehrin farklı duraklarını tek bir turda görmek isteyen misafirler için ideal bir seçenektir.",
      thingsToBring: [
        "Rahat ve hafif kıyafetler",
        "Güneş gözlüğü",
        "Güneş şapkası",
        "Fotoğraf makinesi",
      ],
      importantNotes: [
        "Yemek fiyata dahil değildir.",
        "Alışveriş için nakit veya kredi kartı bulundurmanız önerilir.",
        "Sandland ziyareti tur programına dahildir.",
      ],
    },
    en: {
      title: "Antalya Highlights Tour",
      shortDescription:
        "A relaxed Antalya city tour with a boat trip, free time at the bazaar, Karpuzkaldıran Waterfall and a Sandland visit.",
      description:
        "This tour brings together some of the best-known stops in Antalya in one comfortable program. After meeting in Antalya and visiting a jewelry center, guests enjoy an approximately 40-minute boat trip from the marina, around 2 hours of free time at the city bazaar, a stop at Karpuzkaldıran Waterfall and a visit to Sandland.",
      thingsToBring: [
        "Comfortable light clothing",
        "Sunglasses",
        "Sun hat",
        "Camera",
      ],
      importantNotes: [
        "Meal is not included.",
        "Cash or a credit card is recommended for shopping.",
        "Sandland visit is included in the tour program.",
      ],
    },
    de: {
      title: "Antalya Highlights Tour",
      shortDescription:
        "Eine angenehme Stadttour in Antalya mit Bootsfahrt, Freizeit im Basar, Karpuzkaldıran-Wasserfall und Sandland-Besuch.",
      description:
        "Diese Tour zeigt dir einige der bekanntesten Orte Antalyas in einem einzigen Programm. Nach dem Treffen in Antalya und dem Besuch eines Schmuckzentrums folgt eine etwa 40-minütige Bootsfahrt ab dem Yachthafen, rund 2 Stunden Freizeit im Basar, ein Stopp am Karpuzkaldıran-Wasserfall und der Besuch von Sandland.",
      thingsToBring: [
        "Bequeme leichte Kleidung",
        "Sonnenbrille",
        "Sonnenhut",
        "Kamera",
      ],
      importantNotes: [
        "Essen ist nicht inklusive.",
        "Für Einkäufe werden Bargeld oder Kreditkarte empfohlen.",
        "Der Besuch von Sandland ist im Programm enthalten.",
      ],
    },
  },
  "antalya-by-night": {
    tr: {
      title: "Antalya Akşam Turu",
      shortDescription:
        "Tekne turu, bazarda yaklaşık 2 saat serbest zaman, Karpuzkaldıran Şelalesi ve Sandland ziyareti sunan keyifli akşam turu.",
      description:
        "Antalya By Night Turu ile şehri akşam atmosferinde keşfetme fırsatı yakalayabilirsiniz. Program kapsamında Antalya'da buluşma ve takı merkezi ziyareti sonrası yaklaşık 45 dakikalık tekne turu yapılır. Ardından bazarda yaklaşık 2 saatlik serbest zaman verilir. Günün devamında Karpuzkaldıran Şelalesi ziyaret edilir ve programa dahil olan Sandland gezisi ile tur tamamlanır.",
      thingsToBring: [
        "Rahat ve hafif kıyafetler",
        "Fotoğraf makinesi",
        "Güneş gözlüğü",
        "Güneş şapkası",
      ],
      importantNotes: [
        "Yemek fiyata dahil değildir.",
        "Alışveriş için nakit veya kredi kartı bulundurmanız önerilir.",
        "Sandland ziyareti tur programına dahildir.",
      ],
    },
    en: {
      title: "Antalya by Night Tour",
      shortDescription:
        "A pleasant evening tour with a boat trip, around 2 hours of free time at the bazaar, Karpuzkaldıran Waterfall and Sandland.",
      description:
        "This program lets guests experience Antalya in an evening atmosphere. After meeting in Antalya and visiting a jewelry center, the tour continues with an approximately 45-minute boat trip, around 2 hours of free time at the bazaar, a stop at Karpuzkaldıran Waterfall and a visit to Sandland.",
      thingsToBring: [
        "Comfortable light clothing",
        "Camera",
        "Sunglasses",
        "Sun hat",
      ],
      importantNotes: [
        "Meal is not included.",
        "Cash or a credit card is recommended for shopping.",
        "Sandland visit is included in the tour program.",
      ],
    },
    de: {
      title: "Antalya am Abend",
      shortDescription:
        "Eine angenehme Abendtour mit Bootsfahrt, etwa 2 Stunden Freizeit im Basar, Karpuzkaldıran-Wasserfall und Sandland.",
      description:
        "Diese Tour zeigt Antalya in einer besonderen Abendstimmung. Nach dem Treffen in Antalya und dem Besuch eines Schmuckzentrums folgt eine etwa 45-minütige Bootsfahrt, rund 2 Stunden Freizeit im Basar, ein Halt am Karpuzkaldıran-Wasserfall und anschließend der Besuch von Sandland.",
      thingsToBring: [
        "Bequeme leichte Kleidung",
        "Kamera",
        "Sonnenbrille",
        "Sonnenhut",
      ],
      importantNotes: [
        "Essen ist nicht inklusive.",
        "Für Einkäufe werden Bargeld oder Kreditkarte empfohlen.",
        "Der Besuch von Sandland ist im Programm enthalten.",
      ],
    },
  },
  "aquarium-antalya": {
    tr: {
      title: "Akvaryum ve Antalya Turu",
      shortDescription:
        "Akvaryum ziyareti ve Antalya şehir merkezinde yaklaşık 2 saat serbest zaman sunan keyifli günlük tur.",
      description:
        "Akvaryum ve Antalya Turu ile hem Antalya şehir atmosferini keşfedebilir hem de etkileyici akvaryum deneyimini yaşayabilirsiniz. Program kapsamında Antalya’da buluşma sonrası takı merkezi ziyareti yapılır, ardından yaklaşık 1,5 saatlik akvaryum gezisi gerçekleştirilir ve şehir merkezinde yaklaşık 2 saat serbest zaman verilir.",
      thingsToBring: [
        "Rahat ve hafif kıyafetler",
        "Fotoğraf makinesi",
        "Güneş gözlüğü",
        "Güneş şapkası",
      ],
      importantNotes: [
        "Yemek fiyata dahil değildir.",
        "Alışveriş için nakit veya kredi kartı bulundurmanız önerilir.",
      ],
    },
    en: {
      title: "Aquarium and Antalya Tour",
      shortDescription:
        "A daily tour with an aquarium visit and around 2 hours of free time in Antalya city center.",
      description:
        "This tour combines the atmosphere of Antalya with an impressive aquarium experience. After meeting in Antalya and stopping at a jewelry center, guests enjoy approximately 1.5 hours at the aquarium followed by around 2 hours of free time in the city center.",
      thingsToBring: [
        "Comfortable light clothing",
        "Camera",
        "Sunglasses",
        "Sun hat",
      ],
      importantNotes: [
        "Meal is not included.",
        "Cash or a credit card is recommended for shopping.",
      ],
    },
    de: {
      title: "Aquarium und Antalya Tour",
      shortDescription:
        "Ein Tagesausflug mit Aquarium-Besuch und etwa 2 Stunden Freizeit im Stadtzentrum von Antalya.",
      description:
        "Diese Tour verbindet die Atmosphäre Antalyas mit einem eindrucksvollen Aquarium-Erlebnis. Nach dem Treffen in Antalya und einem Besuch im Schmuckzentrum verbringen die Gäste etwa 1,5 Stunden im Aquarium und haben danach rund 2 Stunden Freizeit im Stadtzentrum.",
      thingsToBring: [
        "Bequeme leichte Kleidung",
        "Kamera",
        "Sonnenbrille",
        "Sonnenhut",
      ],
      importantNotes: [
        "Essen ist nicht inklusive.",
        "Für Einkäufe werden Bargeld oder Kreditkarte empfohlen.",
      ],
    },
  },
  "aquarium-antalya-evening": {
    tr: {
      title: "Akvaryum ve Antalya Akşam Turu",
      shortDescription:
        "Antalya şehir merkezinde yaklaşık 2 saat serbest zaman ve akvaryum ziyareti sunan keyifli akşam turu.",
      description:
        "Akvaryum ve Antalya Akşam Turu ile günün ilerleyen saatlerinde Antalya’yı farklı bir atmosferde keşfedebilirsiniz. Program kapsamında Antalya’da buluşma sonrası takı merkezi ziyareti yapılır, şehir merkezinde yaklaşık 2 saat serbest zaman verilir ve ardından yaklaşık 1,5 saatlik akvaryum gezisi gerçekleştirilir.",
      thingsToBring: [
        "Rahat ve hafif kıyafetler",
        "Fotoğraf makinesi",
        "Güneş gözlüğü",
        "Güneş şapkası",
      ],
      importantNotes: [
        "Yemek fiyata dahil değildir.",
        "Alışveriş için nakit veya kredi kartı bulundurmanız önerilir.",
      ],
    },
    en: {
      title: "Aquarium and Antalya Evening Tour",
      shortDescription:
        "An evening tour with around 2 hours of free time in Antalya city center and an aquarium visit.",
      description:
        "This program offers a different view of Antalya later in the day. After meeting in Antalya and visiting a jewelry center, guests have around 2 hours of free time in the city center before an approximately 1.5-hour aquarium visit.",
      thingsToBring: [
        "Comfortable light clothing",
        "Camera",
        "Sunglasses",
        "Sun hat",
      ],
      importantNotes: [
        "Meal is not included.",
        "Cash or a credit card is recommended for shopping.",
      ],
    },
    de: {
      title: "Aquarium und Antalya Abendtour",
      shortDescription:
        "Eine Abendtour mit etwa 2 Stunden Freizeit im Stadtzentrum von Antalya und einem Aquarium-Besuch.",
      description:
        "Diese Tour zeigt Antalya zu einer anderen Tageszeit. Nach dem Treffen in Antalya und dem Besuch eines Schmuckzentrums haben die Gäste rund 2 Stunden Freizeit im Stadtzentrum, bevor der etwa 1,5-stündige Aquarium-Besuch beginnt.",
      thingsToBring: [
        "Bequeme leichte Kleidung",
        "Kamera",
        "Sonnenbrille",
        "Sonnenhut",
      ],
      importantNotes: [
        "Essen ist nicht inklusive.",
        "Für Einkäufe werden Bargeld oder Kreditkarte empfohlen.",
      ],
    },
  },
  "buggy-safari": {
    tr: {
      title: "Buggy Safari Turu",
      shortDescription:
        "Doğa içinde yaklaşık 1 saat 45 dakikalık sürüş sunan, adrenalin dolu buggy safari deneyimi.",
      description:
        "Buggy Safari Turu ile tatilinize heyecan ve macera katabilirsiniz. Otelden alınış ile başlayan programda safari alanına geçilir, kısa deneme sürüşünün ardından doğa içinde yaklaşık 1 saat 45 dakikalık buggy safari deneyimi yaşanır.",
      thingsToBring: [
        "Rahat ve hafif kıyafetler",
        "Fotoğraf makinesi",
        "Ekstra harcamalar için nakit",
      ],
      importantNotes: [
        "Yemek fiyata dahil değildir.",
        "Koruyucu gözlük ekstra ücrete tabidir.",
        "Ağız bandı ekstra ücrete tabidir.",
        "İçecekler ekstra ücrete tabidir.",
        "17 yaş ve üzeri katılımcılar için 2. kişi fiyatı 25 EUR olarak belirtilmiştir.",
      ],
    },
    en: {
      title: "Buggy Safari Tour",
      shortDescription:
        "An adrenaline-filled buggy safari with approximately 1 hour 45 minutes of driving through nature.",
      description:
        "This experience adds action and adventure to your holiday. After hotel pickup and a short test drive, guests head out on an approximately 1 hour 45 minute buggy route through dusty and exciting tracks in nature.",
      thingsToBring: [
        "Comfortable light clothing",
        "Camera",
        "Cash for extras",
      ],
      importantNotes: [
        "Meal is not included.",
        "Protective goggles are extra.",
        "Bandana is extra.",
        "Drinks are extra.",
        "For participants aged 17 and above, the second person price is 25 EUR.",
      ],
    },
    de: {
      title: "Buggy Safari Tour",
      shortDescription:
        "Ein adrenalinreiches Buggy-Safari-Erlebnis mit etwa 1 Stunde 45 Minuten Fahrt durch die Natur.",
      description:
        "Diese Tour bringt Spannung und Abenteuer in deinen Urlaub. Nach der Abholung vom Hotel und einer kurzen Probefahrt startet die etwa 1 Stunde 45 Minuten lange Buggy-Strecke auf staubigen und unterhaltsamen Pisten in der Natur.",
      thingsToBring: [
        "Bequeme leichte Kleidung",
        "Kamera",
        "Bargeld für Extras",
      ],
      importantNotes: [
        "Essen ist nicht inklusive.",
        "Schutzbrille kostet extra.",
        "Bandana kostet extra.",
        "Getränke kosten extra.",
        "Für Teilnehmer ab 17 Jahren beträgt der Preis für die zweite Person 25 EUR.",
      ],
    },
  },
  "antalya-4u-1-arada-macera-turu": {
    tr: {
      title: "Antalya 4'ü 1 Arada Macera Turu",
      shortDescription:
        "Buggy, mini zipline, monster truck, rafting ve ringo deneyimlerini bir araya getiren aksiyon dolu Antalya turu.",
      description:
        "Antalya 4'ü 1 Arada Macera Turu ile tek bir günde adrenalin, doğa ve eğlenceyi bir arada yaşayın. Gün, otelden konforlu transfer ile başlar; ardından etkileyici Tazı Kanyonu ve tarihi Roma Köprüsü ziyaretiyle eşsiz manzaraların tadını çıkarırsınız. Sonrasında buggy sürüşü, mini zipline, monster truck deneyimi, rafting ve ringo gibi heyecan dolu aktivitelerle gün boyu enerjiniz hiç düşmez.",
      thingsToBring: [
        "Rahat ve hafif kıyafetler",
        "Güneş gözlüğü",
        "Güneş şapkası",
        "Mayo veya uygun su kıyafeti",
        "Havlu",
        "Suya uygun ayakkabı",
        "Fotoğraf makinesi",
      ],
      importantNotes: ["Ekstra harcamalar için nakit bulundurmanız önerilir."],
    },
    en: {
      title: "Antalya 4-in-1 Adventure Tour",
      shortDescription:
        "An action-packed Antalya tour combining buggy, mini zipline, monster truck, rafting and ringo in one day.",
      description:
        "This full-day program combines adrenaline, nature and fun in a single experience. After hotel transfer, guests visit Tazi Canyon and the historic Roman Bridge before continuing with buggy riding, mini zipline, monster truck, rafting and ringo. Lunch is included.",
      thingsToBring: [
        "Comfortable light clothing",
        "Sunglasses",
        "Sun hat",
        "Swimwear or water-friendly clothing",
        "Towel",
        "Water shoes",
        "Camera",
      ],
      importantNotes: ["Cash is recommended for extra expenses."],
    },
    de: {
      title: "Antalya 4-in-1 Abenteuer Tour",
      shortDescription:
        "Eine actionreiche Antalya-Tour mit Buggy, Mini-Zipline, Monster Truck, Rafting und Ringo an einem Tag.",
      description:
        "Dieses ganztägige Programm verbindet Adrenalin, Natur und Spaß in einem einzigen Erlebnis. Nach dem Transfer vom Hotel besuchen die Gäste den Tazi Canyon und die historische Römerbrücke, bevor es mit Buggy, Mini-Zipline, Monster Truck, Rafting und Ringo weitergeht. Das Mittagessen ist inklusive.",
      thingsToBring: [
        "Bequeme leichte Kleidung",
        "Sonnenbrille",
        "Sonnenhut",
        "Badebekleidung oder wassergeeignete Kleidung",
        "Handtuch",
        "Wasserschuhe",
        "Kamera",
      ],
      importantNotes: ["Für zusätzliche Ausgaben wird Bargeld empfohlen."],
    },
  },
};

export const tours: TourDocument[] = baseTours.map((tour) => ({
  ...tour,
  localized: {
    ...(tour.localized || {}),
    ...(localeOverrides[tour.slug as string] || {}),
  },
}));

const MOJIBAKE_FRAGMENTS = ['Ã¼', 'Ãœ', 'Ã¶', 'Ã–', 'Ã§', 'Ã‡', 'Ä±', 'Ä°', 'ÅŸ', 'Åž', 'â€™', 'â€“', 'â€œ', 'â€'];

function repairSuspiciousEncoding(value: string) {
  if (!MOJIBAKE_FRAGMENTS.some((fragment) => value.includes(fragment))) {
    return value;
  }

  return Buffer.from(value, "latin1").toString("utf8");
}

function sanitizeSeedValue<T>(value: T): T {
  if (typeof value === "string") {
    return repairSuspiciousEncoding(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeSeedValue(entry)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, sanitizeSeedValue(entry)]),
    ) as T;
  }

  return value;
}

function collectSuspiciousPaths(value: unknown, path = "root"): string[] {
  if (typeof value === "string") {
    return MOJIBAKE_FRAGMENTS.some((fragment) => value.includes(fragment)) ? [path] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => collectSuspiciousPaths(entry, `${path}[${index}]`));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, entry]) => collectSuspiciousPaths(entry, `${path}.${key}`));
  }

  return [];
}

export function prepareSeedTour(tour: TourDocument): TourDocument {
  const sanitizedTour = sanitizeSeedValue(tour);
  const suspiciousPaths = collectSuspiciousPaths(sanitizedTour);

  if (suspiciousPaths.length > 0) {
    throw new Error(
      `Seed data still contains suspicious encoding for "${tour.slug}" at: ${suspiciousPaths.slice(0, 5).join(", ")}`,
    );
  }

  return sanitizedTour;
}

export async function seedTours(seedItems: TourDocument[] = tours) {
  if (!adminDb) {
    throw new Error(
      "Firebase Admin SDK is not initialized. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.",
    );
  }

  const collectionRef = adminDb.collection("tours");
  const refs = seedItems.map((tour) => collectionRef.doc(String(tour.slug)));
  const existingSnapshots = await adminDb.getAll(...refs);

  await commitInBatches(adminDb, seedItems, (_batch, tour, index) => {
    const preparedTour = prepareSeedTour(tour);
    const existingCreatedAt = existingSnapshots[index]?.get("createdAt");

    _batch.set(refs[index], {
      ...preparedTour,
      createdAt: existingCreatedAt ?? FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  console.log(`Seeded ${seedItems.length} tours`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  seedTours().catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  });
}
