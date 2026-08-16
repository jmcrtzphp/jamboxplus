export interface Channel {
  name: string;
  url: string;
  key?: string | string[];
  logo?: string;
  epgId?: string;
}

export const channels: Channel[] = [
  {
    name: "A2Z",
    epgId: "cg_a2z",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_a2z/default/index.mpd",
    key: "f3a8c9126e544d809b312c7f5a8e6140:43f5361983896b47ff01b4f77c5dbf3f",
    logo: "https://philippines.mom-gmr.org/uploads/tx_lfrogmom/media/1419-2446_import.png"
  },
  {
    name: "ABC Australia",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/abc_aus/default/index.mpd",
    key: "d6f1a8c29b7e4d5a8f332c1e9d7b6a90:790bd17b9e623e832003a993a2de1d87",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55ACCD6-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "abc_australia"
  },
  {
    name: "Al Jazeera English",
    epgId: "dr_aljazeera",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/dr_aljazeera/default/index.mpd",
    key: "73c5f8919d424b06a2186e7c3a5d9040:bf46e85e8fba9f0eae0931394d478d25"
  },
  {
    name: "Animal Planet",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_animal_planet_sd/default/index.mpd",
    key: [
      "3c8e5a927d414b069f236a5c8e1d7049:a9b9198bf7b116b30492aea4dc471122",
      "1c9f7a6d3b2e4e5d8a61f4d0c2b9e813:b8f52451c67a2b54f272543eef45b621",
      "436b69f987924fcbbc06d40a69c2799a:c63d5b0d7e52335b61aeba4f6537d54d"
    ],
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A57B0-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "cg_animal_planet_sd"
  },
  {
    name: "Animax",
    epgId: "cg_animax_sd_new",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_animax_sd_new/default/index.mpd",
    key: "a7d3f5916c844b209e158f3a7d5c2046:021fe5515e7dfb1a00a98d51abd0cb7f"
  },
  {
    name: "Arirang TV",
    epgId: "arirang_sd",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/arirang_sd/default/index.mpd",
    key: "7d4f9c216a834e508b165c3a7d5f8049:9d148906d890053a00f5e581185ac066"
  },
  {
    name: "Asian Food Network",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/asianfoodnetwork_sd/default/index.mpd",
    key: "f4b7c8219e364a058d295c6f3e7a1042:d10c7f2a37c1079e6b83837423c0d6b2",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55AB020-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "asianfoodnetwork_sd"
  },
  {
    name: "AXN",
    epgId: "cg_axn_sd",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_axn_sd/default/index.mpd",
    key: "c7e5a2199d644b318f702a6c4e5d8139:300778996b5a71594db508982256f365"
  },
  {
    name: "BBC Earth HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_bbcearth_hd1/default/index.mpd",
    key: "4f9c6e217a354d80b9268e5c3f1a7042:41b33eebbacf91fe6c86bd28081bf3fd",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A6868-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "cg_bbcearth_hd1"
  },
  {
    name: "BBC World News",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/bbcworld_news_sd/default/index.mpd",
    key: "f1a6e8329c574b048d216e5f3a7c9048:8106237b47f99be13f4e941ca5bd35c5",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A847E-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "bbcworld_news_sd"
  },
  {
    name: "Bilyonaryo News Channel",
    epgId: "bilyonaryoch",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/bilyonaryoch/default/index.mpd",
    key: "2e7f9c518a424d30b2165c3e7a9d6041:8c8c0ef924c982bc1dd92348e024cd4c",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/ce/BilyonaryoNewsChannel_Logo_-_Black_%282024%29.png"
  },
  {
    name: "Bloomberg Television",
    epgId: "bloomberg_sd",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/bloomberg_sd/default/index.mpd",
    key: "19f6c8325a744d90b2618e3f7c2a5049:784fffb38dc4fb6d5b74de822074feb4"
  },
  {
    name: "BuKo Channel",
    epgId: "buko",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_buko_sd/default/index.mpd",
    key: "c8b1d5f42a674e93b8016f2d9c7a5e34:168bbf02d7eca252a61a402e25cb33f5"
  },
  {
    name: "Cartoon Network HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cartoonnetworkhd/default/index.mpd",
    key: "53c8e6914d724f30a9168b5e2c7d1043:1e17afbdfff786533796780f3f04aa67",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A51FC-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "cartoonnetworkhd"
  },
  {
    name: "CCTV-4",
    epgId: "dr_cctv4",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/dr_cctv4/default/index.mpd",
    key: "83e5c4917d624b00a2196f3c8a5e2047:d8fae6a24d5df3fa8e17a8f4a4854426"
  },
  {
    name: "Celestial Movies Pinoy",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/celmovie_pinoy_sd/default/index.mpd",
    key: "35f8d6917a424b059e166c3a7d5f8049:76830e1bcb5819f76b7c515e9d65cc31"
  },
  {
    name: "CGTN",
    epgId: "cgtn",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cgtn/default/index.mpd",
    key: "f2a7d6318c544b099e216d5f3a7c8042:1abff1626a5403fa2ea8964c2f3b9c1d"
  },
  {
    name: "Cinema One",
    url: "https://abslive.akamaized.net/dash/live/2027618/c1ph/manifest.mpd",
    key: "55eddd1e157e4c3b830866e4679e7032:525030e984567ba8df0af80660952368"
  },
  {
    name: "Cinemax",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_cinemax/default/index.mpd",
    key: "d7a9c5215e364b809f148c2d6a7e3045:c92a3b4a7fe9fab97c130468260b963f",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/BC3C51E7-F1A5-46DE-979D-65DC483AE59C/0-16x9.png",
    epgId: "cg_cinemax"
  },
  {
    name: "Cinemo",
    url: "https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-cinemo-dash-abscbnono/index.mpd",
    key: "aa8aebe35ccc4541b7ce6292efcb1bfb:f06b6031a3604cc6708c14d83f1a1b27"
  },
  {
    name: "CNA (Channel NewsAsia)",
    epgId: "channelnewsasia",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/channelnewsasia/default/index.mpd",
    key: "56d8c4917a234e60b9159f3a7d5c2048:e6f0a100b6a2fcda66e8554f8c9b510b"
  },
  {
    name: "CNN HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_cnnhd/default/index.mpd",
    key: "1d9f6b828c454a17b2395e7d3f90a621:c5776d83cbf50c9354f27b1c830e1996",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A5468-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "cg_cnnhd"
  },
  {
    name: "Crime & Investigation",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/crime_invest/default/index.mpd",
    key: "e7a3d5916c824b459f105d8e2c7a3046:616f8ab0c416966e8de415cb60e9e6cf",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55AD5C8-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "crime_invest"
  },
  {
    name: "DepEd TV",
    epgId: "depedch_sd",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/depedch_sd/default/index.mpd",
    key: "c1a5e8329d644f70b2187a3c6e5d2041:55979431f291f7dff35a43b73b3c2a36"
  },
  {
    name: "Discovery Channel",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/discovery/default/index.mpd",
    key: "d5a7f8219c364e50b2147f6d3a8c9025:c77d5e56c52c4065c42594422ac85e2c",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A734E-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "discovery"
  },
  {
    name: "DreamWorks HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_dreamworks_hd1/default/index.mpd",
    key: "1f7c9a425d864e30b2198a3c6f7d5041:b392ee3cd42686a8cff3070eef614745",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A5698-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "cg_dreamworks_hd1"
  },
  {
    name: "Fashion TV HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/fashiontvhd/default/index.mpd",
    key: "c8a4e6917f324d05b9186c5e3a2f7049:92b4ece8c84379145045267b47f183d2",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A9D06-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "fashiontvhd"
  },
  {
    name: "Food Network HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_foodnetwork_hd1/default/index.mpd",
    key: "b1f4a8926c374d509e218a7c3f5d6049:15cde0b44b44f38ea936513a99606c1b",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A9496-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "cg_foodnetwork_hd1"
  },
  {
    name: "France 24",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/france24/default/index.mpd",
    key: "92d8f3416c754b09a2187e5d3a9c6042:4e668d238bc656b7d2c7535757aa9531",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55AC9B6-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "france24"
  },
  {
    name: "Global Trekker",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/globaltrekker/default/index.mpd",
    key: "e4b8d2916a534f709c187d3e5a2f6049:85d67d8b52caf380c82dc45b07f26f69",
    epgId: "globaltrekker"
  },
  {
    name: "HBO Family",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_hbofam/default/index.mpd",
    key: "c6e4b9218f534a709d165c3a7e2f8048:87c0e7cf73324aea32dada7b5f33063d",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/62F1A4ED-EB56-49DF-912D-0A2388131772/0-16x9.png",
    epgId: "cg_hbofam"
  },
  {
    name: "HBO HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_hbohd/default/index.mpd",
    key: "d7f3c8215a944e068b176c9d2a5f3048:93c0a798243d6443864d1a7ff3e42c05",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/B741DD7A-A7F8-4F8A-A549-9EF411020F9D/0-16x9.png",
    epgId: "cg_hbohd"
  },
  {
    name: "HBO Hits",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_hbohits/default/index.mpd",
    key: "3e8c5a917d424f06b2196a5c9e2d8043:516c47ccef00a12421d9805c8c1c6c1d",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/CEE83EE5-D870-4B3C-9339-ACA7FF4020D0/0-16x9.png",
    epgId: "hits_hd1"
  },
  {
    name: "HBO Signature",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_hbosign/default/index.mpd",
    key: "74d8f5916c234b80a9179e5d3c7a2046:f8d2753ff54579efc01d3373acf21f96",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/D5127959-34E4-41B2-AA80-CE74DDC2C3C4/0-16x9.png",
    epgId: "cg_hbosign"
  },
  {
    name: "HGTV HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/hgtv_hd1/default/index.mpd",
    key: "4e9a6c317d524f808b163c5a2e7d9048:5079e2288b584f47d4bbf8d149b2a986",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A858C-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "hgtv_hd1"
  },
  {
    name: "History HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/dr_historyhd/default/index.mpd",
    key: "f5c7a8219d464e30b2186a3f7c5d9041:dacc84b7010ca22f8c63a7c290461ed3",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A9C02-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "dr_historyhd"
  },
  {
    name: "HITS",
    epgId: "hits_hd1",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/hits_hd1/default/index.mpd",
    key: "d2e8c4715a634f09b2187c6d3e9a5042:8b11760042654021997fd07a8a0b7acc"
  },
  {
    name: "HITS Movies",
    epgId: "hits_movies",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/hitsmovies/default/index.mpd",
    key: "45c9e7328b614d059f247a6c3e5d1048:13ef5feae7c84eb06bcc655a225fb01d"
  },
  {
    name: "HITS NOW",
    epgId: "hits_hd1",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_hitsnow/default/index.mpd",
    key: "24a8e6917c534d809f165b3e6a2d9047:183f05bcb80e9cfcb613b8c767777f27"
  },
  {
    name: "IBC 13",
    epgId: "ibc13_sd_new",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/ibc13_sd_new/default/index.mpd",
    key: "f4a8d6216c954e709b187d3a5f2c8049:34710df996a4089ee6f7e8deb7f46586"
  },
  {
    name: "Kapamilya",
    url: "https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-kapcha-dash-abscbnono/manifest.mpd",
    key: "292dee4236d04054910e9706ee22626b:b7c5d3220f6eb6e042a2bcb367b5c09b"
  },
  {
    name: "Kapatid Channel",
    epgId: "kapatid_hd",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/kapatid_hd/default/index.mpd",
    key: "8f7a2c913d6b4e5a9f127c8d4e6a1b90:a73d3d1211fb23084c62572706f45397"
  },
  {
    name: "KBS World",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/kbsworld/default/index.mpd",
    key: "e8c5d2317a944f06b2186d3a9e7c5042:ce327be0871677eb1c480d10a73eac34",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A7CE0-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "kbsworld"
  },
  {
    name: "KIX HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/kix_hd1/default/index.mpd",
    key: "7f4a9c312e854d67b0198c6f5a3e7240:141f058ad1a6230e7c6f9d302ce378ef",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A7EE8-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "kix_hd1"
  },
  {
    name: "Knowledge Channel",
    epgId: "knowledge_channel",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/knowledge_channel/default/index.mpd",
    key: "84d2f6917b354c08a9163e5d8f2a7049:192c69ef479dd7e3fccc908d6c5dbb3a"
  },
  {
    name: "Lifetime",
    epgId: "dr_lifetime",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/dr_lifetime/default/index.mpd",
    key: "b9e6a3214c754f908d165a3c7e2f6048:32300d9517f91a4acb747d360768dd00"
  },
  {
    name: "Lotus Macau",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/lotusmacau_prd/default/index.mpd",
    key: "e2c9a5748b314f60a9276d5e3c1f8042:c845cc41e3826b6d880b802911eb43f9",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/C6AB65CE-37A0-4040-ABA7-021C669DBEE1/0-16x9.png",
    epgId: "lotusmacau_prd"
  },
  {
    name: "Moonbug Kids",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_moonbug_kids_sd/default/index.mpd",
    key: "48e7d3219c564f80b2147a5d3e6c2048:23a7b41054c60983ad020652f7ffa06e",
    epgId: "cg_moonbug_kids_sd"
  },
  {
    name: "NBA TV",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cgnl_nba/default/index.mpd",
    key: "2f7c9a615d834e40b2188a6d3c7f9042:41d2ade5ff1798859420e925d5d2080d",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/3327FF64-3E52-42DE-B516-4629BFABA8C7/0-16x9.png"
  },
  {
    name: "NHK World-Japan",
    epgId: "NHKWorldJapan",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/dr_nhk_japan/default/index.mpd",
    key: "a3d7f5916c824e09b2158a5c3f7d2046:32d760047f05c233d9dae35083fe0b30"
  },
  {
    name: "Nick Jr",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/dr_nickjr/default/index.mpd",
    key: "ca7e5b318d624f099c246a3e7d5f8140:3175f0646c504fad87e97c7677a85393",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55AB8E0-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "dr_nickjr"
  },
  {
    name: "Nickelodeon",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/dr_nickelodeon/default/index.mpd",
    key: "81f3e6924c754a08b9215d7e9c3f6048:094cd48e9729cb8bcb0e03e848fc8751",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55ADD5C-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "dr_nickelodeon"
  },
  {
    name: "One News HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/onenews_hd1/default/index.mpd",
    key: "d5c8a2914e734b609f127a3d6c5e8048:11368a3b001407d65a85b4edb410ecdd",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A7DDA-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "onenews_hd1"
  },
  {
    name: "One PH",
    epgId: "oneph_sd",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/oneph_sd/default/index.mpd",
    key: "5e9a3c718d464f20b9157a6c2e4d8031:7bf8a7666a2d572fe111b5f829c99266"
  },
  {
    name: "One Sports HD",
    epgId: "cg_onesports_hd",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_onesports_hd/default/index.mpd",
    key: "69f5a2318d744c609b125e3a7d5f8049:182523c0bae912e17e916dd4283280e9"
  },
  {
    name: "One Sports Plus HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_onesportsplus_hd1/default/index.mpd",
    key: "e9c4f7312a854d69b0137f6e8c2a5490:1105fa92173b06885be336b887bc4d26",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A696C-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "cg_onesports_hd"
  },
  {
    name: "PBA Rush HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_pbarush_hd1/default/index.mpd",
    key: "91a5e6327c844f09b2186d3a5e7c2041:984beb3aeff3554c1a5acc04d6044e55",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A7650-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "cg_pbarush_hd1"
  },
  {
    name: "Premier Sports 2 HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/premiersports2hd/default/index.mpd",
    key: "72e4b9c13f864a52a9178d6c0e5b2394:9390c1edae5ecf680c168daf44bf6a03",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A899C-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "premiersports2hd"
  },
  {
    name: "Premier Sports HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_ps_hd1/default/index.mpd",
    key: "91e4c6725a834d198f602c7b9e3a5148:4185d260443198690be03e294fdc1240",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A6228-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "cg_ps_hd1"
  },
  {
    name: "PTV 4",
    epgId: "cg_ptv4_sd",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_ptv4_sd/default/index.mpd",
    key: "f8c2a6915d744b309e186a3f7c2d8049:1ad3243b38c60312caa6ba11f150c19c"
  },
  {
    name: "Rock Entertainment",
    epgId: "dr_rockentertainment",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/dr_rockentertainment/default/index.mpd",
    key: "86e5c7921a434f609b2187c6d3e9a5041:fab817af24eab2a73ae89145797cf556"
  },
  {
    name: "Rock Extreme",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/dr_rockextreme/default/index.mpd",
    key: "d9a4f5218c374b069e156f2d7a3c8049:72aa902f471adf15bef2710b6b689ed0",
    epgId: "dr_rockextreme"
  },
  {
    name: "RPTV HD",
    epgId: "cg_ptv4_sd",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cnn_rptv_prod_hd/default/index.mpd",
    key: "b5d7a6219c434e188f026a3d7c5e9148:28e1244057ff6feae879c1e985ded0fb"
  },
  {
    name: "SPOTV 2 HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/dr_spotv2hd/default/index.mpd",
    key: "b2d8f6315c494e07a8129f6a3d5c2048:6b4247def21bbd0d08629a3cb4c62ee9",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A6A70-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "cg_spotvhd"
  },
  {
    name: "SPOTV HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_spotvhd/default/index.mpd",
    key: "c5e8a3927d414b609f286a3c5e1d7049:7c5edbd3d090bb6de9a9c3685defa959",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A5BC0-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "cg_spotvhd"
  },
  {
    name: "Tagalog Movie Channel",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_tagalogmovie/default/index.mpd",
    key: "27f6c4818a534d09b2169e5c7a3f6048:fbd8e319511ff5a1593f5b68da7b81cd",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/A9E09C52-721F-4316-ABB9-35EF145B69C0/0-16x9.png"
  },
  {
    name: "TAP Movies HD",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_tapmovies_hd1/default/index.mpd",
    key: "65d8c4912f734a90b8163e7c5d9a2041:fd495b984013da4e26f83b1a921c0a15",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55AC48E-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "cg_tapmovies_hd1"
  },
  {
    name: "Tap Sports",
    epgId: "dr_tapsports",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/dr_tapsports/default/index.mpd",
    key: "a6d4f8912c734b608e159f3a7d5c2046:ec647e6c500235352a8df03c518e9b23"
  },
  {
    name: "ThinkKast Bypass",
    url: "http://thinkkast.dpdns.org/play.m3u8"
  },
  {
    name: "Thrill",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_thrill_sd/default/index.mpd",
    key: "b8c3d5906e424f17a9215d8c7a2e6043:02ce48f1b48f7cbdc3e2703a56e8fa31",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55AD230-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "cg_thrill_sd"
  },
  {
    name: "Travel Channel",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/travel_channel_sd/default/index.mpd",
    key: "18c6f9235b744d81a0397e2c9f6a5048:7974c1376447c563f5fdb41be0104ddf",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55A8898-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "travel_channel_sd"
  },
  {
    name: "True FM TV",
    epgId: "truefm_tv",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/truefm_tv/default/index.mpd",
    key: "8c4e9a516d724f30b2187a3c5e9d6041:e25c167573772b510ff8e5282560a349"
  },
  {
    name: "TV Maria",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/tvmaria_prd/default/index.mpd",
    key: "6a2d9f815c744e30b9168f3a7d2c5049:fb07ec8ca16ffdb8b8a045fa4c8aac74",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/2C55AD7F-3589-48DA-BEC4-005200215975/0-16x9.png",
    epgId: "tvmaria_prd"
  },
  {
    name: "TV5 HD",
    epgId: "tv5",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/tv5_hd/default1/index.mpd",
    key: "9c3e7a516d824f04a9175b8c2e3d7040:524a9c2cec98272f71c347345a3fd12e"
  },
  {
    name: "TV5 Monde",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/dr_tv5_monde/default/index.mpd",
    key: "e6b4c8217a954d309f165c8e2a3d7049:1acbc3a347d31fa2236f180574342e71",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/E55ADB5E-C9E1-11EC-9D64-0242AC120002/0-16x9.png",
    epgId: "dr_tv5_monde"
  },
  {
    name: "tvN Movies",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_tvnmovie/default/index.mpd",
    key: "e6c9a4215d734f608b197c3e2a5d9048:ec695ab203cb2258db220b3863e2a7ee",
    epgId: "cg_tvnmovie"
  },
  {
    name: "TVN Premier",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_tvnmovie/default/index.mpd",
    key: "e6c9a4215d734f608b197c3e2a5d9048:ec695ab203cb2258db220b3863e2a7ee",
    epgId: "cg_tvnmovie"
  },
  {
    name: "UAAP Varsity Channel",
    epgId: "cg_uaap_cplay_sd",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/cg_uaap_cplay_sd/default/index.mpd",
    key: "b6c9f4218d734a059e165c3d7a2f8049:948aa5c0d0c15c70efb9257f5b75c379"
  },
  {
    name: "Vibe TV - TV5",
    url: "https://ucdn.mediaquest.com.ph/bpk-tv/tv5_hd/default1/index.mpd",
    key: "9c3e7a516d824f04a9175b8c2e3d7040:524a9c2cec98272f71c347345a3fd12e",
    logo: "https://qp-pldt-image-resizer-cloud-prod.akamaized.net/image/726AB804-66DE-4684-A455-ABD1683114CF/0-16x9.png",
    epgId: "tv5"
  }
];
