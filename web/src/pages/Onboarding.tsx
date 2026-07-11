import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/Layout";

// Country-Region-District data
const countryData = {
  nigeria: {
    name: "Nigeria",
    regions: {
      abia: { name: "Abia State", districts: ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"] },
      adamawa: { name: "Adamawa State", districts: ["Demsa", "Fufure", "Ganye", "Gayuk", "Gombi", "Grie", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"] },
      akwa_ibom: { name: "Akwa Ibom State", districts: ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono-Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo"] },
      anambra: { name: "Anambra State", districts: ["Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"] },
      bauchi: { name: "Bauchi State", districts: ["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"] },
      bayelsa: { name: "Bayelsa State", districts: ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"] },
      benue: { name: "Benue State", districts: ["Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"] },
      borno: { name: "Borno State", districts: ["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"] },
      cross_river: { name: "Cross River State", districts: ["Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani", "Ogoja", "Yakuur", "Yala"] },
      delta: { name: "Delta State", districts: ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"] },
      ebonyi: { name: "Ebonyi State", districts: ["Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"] },
      edo: { name: "Edo State", districts: ["Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba Okha", "Oredo", "Orhionmwon", "Ovia North-East", "Ovia South-West", "Owan East", "Owan West", "Uhunmwonde"] },
      ekiti: { name: "Ekiti State", districts: ["Ado-Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", "Ise/Orun", "Moba", "Oye"] },
      enugu: { name: "Enugu State", districts: ["Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka", "Oji River", "Udenu", "Udi", "Uzo Uwani"] },
      fct: { name: "Federal Capital Territory", districts: ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Municipal Area Council", "Kwali"] },
      gombe: { name: "Gombe State", districts: ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba"] },
      imo: { name: "Imo State", districts: ["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"] },
      jigawa: { name: "Jigawa State", districts: ["Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kazaure", "Kiri Kasama", "Kiyawa", "Kaugama", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"] },
      kaduna: { name: "Kaduna State", districts: ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"] },
      kano: { name: "Kano State", districts: ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"] },
      katsina: { name: "Katsina State", districts: ["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin Ma", "Faskari", "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"] },
      kebbi: { name: "Kebbi State", districts: ["Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"] },
      kogi: { name: "Kogi State", districts: ["Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"] },
      kwara: { name: "Kwara State", districts: ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi"] },
      lagos: { name: "Lagos State", districts: ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"] },
      nasarawa: { name: "Nasarawa State", districts: ["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"] },
      niger: { name: "Niger State", districts: ["Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Moya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"] },
      ogun: { name: "Ogun State", districts: ["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Sagamu"] },
      ondo: { name: "Ondo State", districts: ["Akoko North-East", "Akoko North-West", "Akoko South-West", "Akoko South-East", "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"] },
      osun: { name: "Osun State", districts: ["Atakunmosa East", "Atakunmosa West", "Aiyedaade", "Aiyedire", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Egbedore", "Ejigbo", "Ife Central", "Ife East", "Ife North", "Ife South", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo"] },
      oyo: { name: "Oyo State", districts: ["Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomoso North", "Ogbomoso South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere"] },
      plateau: { name: "Plateau State", districts: ["Barkin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"] },
      rivers: { name: "Rivers State", districts: ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"] },
      sokoto: { name: "Sokoto State", districts: ["Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"] },
      taraba: { name: "Taraba State", districts: ["Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Kurmi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"] },
      yobe: { name: "Yobe State", districts: ["Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari"] },
      zamfara: { name: "Zamfara State", districts: ["Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Gusau", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Chafe", "Zurmi"] }
    }
  },
  rwanda: {
    name: "Rwanda",
    regions: {
      eastern: { name: "Eastern Province", districts: ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"] },
      western: { name: "Western Province", districts: ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"] },
      northern: { name: "Northern Province", districts: ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"] },
      southern: { name: "Southern Province", districts: ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango"] },
      kigali: { name: "Kigali City", districts: ["Gasabo", "Kicukiro", "Nyarugenge"] }
    }
  },
  kenya: {
    name: "Kenya",
    regions: {
      nairobi: { name: "Nairobi County", districts: ["Westlands", "Dagoretti North", "Dagoretti South", "Langata", "Kibra", "Roysambu", "Kasarani", "Ruaraka", "Embakasi South", "Embakasi North", "Embakasi Central", "Embakasi East", "Embakasi West", "Makadara", "Kamukunji", "Starehe", "Mathare"] },
      central: { name: "Central Kenya", districts: ["Kiambu", "Thika Town", "Ruiru", "Githunguri", "Kiambaa", "Kabete", "Limuru", "Lari", "Gatundu South", "Gatundu North", "Juja", "Murang'a", "Kandara", "Mathioya", "Kigumo", "Kiharu", "Kangema", "Gatanga", "Nyeri", "Tetu", "Kieni", "Mathira", "Othaya", "Mukurweini", "Kirinyaga", "Mwea", "Gichugu", "Ndia"] },
      coast: { name: "Coast Region", districts: ["Mombasa", "Changamwe", "Jomba", "Kisauni", "Nyali", "Likoni", "Mvita", "Kilifi North", "Kilifi South", "Kaloleni", "Rabai", "Ganze", "Malindi", "Magarini", "Kwale", "Msambweni", "Lungalunga", "Matuga", "Kinango", "Tana River", "Garsen", "Galole", "Bura", "Lamu East", "Lamu West", "Taita Taveta", "Taveta", "Wundanyi", "Mwatate", "Voi"] },
      eastern: { name: "Eastern Region", districts: ["Marsabit", "Moyale", "North Horr", "Saku", "Isiolo North", "Isiolo South", "Meru", "Buuri", "Igembe South", "Igembe Central", "Igembe North", "Tigania West", "Tigania East", "North Imenti", "Tharaka", "Chuka/Igambang'ombe", "Tharaka-Nithi", "Maara", "Embu", "Manyatta", "Runyenjes", "Machakos", "Mwala", "Kathiani", "Mavoko", "Masinga", "Yatta", "Kangundo", "Matungulu", "Kitui West", "Kitui Rural", "Kitui Central", "Kitui East", "Kitui South", "Mwingi North", "Mwingi West", "Mwingi Central"] },
      northeastern: { name: "Northeastern Region", districts: ["Garissa", "Balambala", "Lagdera", "Dadaab", "Fafi", "Ijara", "Wajir North", "Wajir East", "Tarbaj", "Wajir West", "Eldas", "Wajir South", "Mandera North", "Banissa", "Mandera West", "Mandera South", "Mandera East", "Lafey"] },
      nyanza: { name: "Nyanza Region", districts: ["Kisumu East", "Kisumu West", "Kisumu Central", "Seme", "Nyando", "Muhoroni", "Nyakach", "Siaya", "Rarieda", "Bondo", "Gem", "Ugenya", "Ugunja", "Homabay", "Kabondo Kasipul", "Kasipul", "Mbita", "Ndhiwa", "Rangwe", "Suba North", "Suba South", "Migori", "Rongo", "Awendo", "Suna East", "Suna West", "Uriri", "Nyatike", "Kuria West", "Kuria East", "Bonchari", "South Mugirango", "Bomachoge Borabu", "Bobasi", "Bomachoge Chache", "Nyaribari Masaba", "Nyaribari Chache", "Kitutu Chache North", "Kitutu Chache South", "Kitutu Masaba", "West Mugirango", "North Mugirango", "Borabu"] },
      rift_valley: { name: "Rift Valley Region", districts: ["Turkana North", "Turkana West", "Turkana Central", "Turkana South", "Turkana East", "Loima", "West Pokot", "Kacheliba", "Kapenguria", "Sigor", "Samburu North", "Samburu Central", "Samburu East", "Trans Nzoia East", "Trans Nzoia West", "Kwanza", "Endebess", "Saboti", "Kiminini", "Uasin Gishu", "Soy", "Turbo", "Moiben", "Ainabkoi", "Kapseret", "Kesses", "Marakwet East", "Marakwet West", "Keiyo North", "Keiyo South", "Tinderet", "Aldai", "Nandi Hills", "Chesumei", "Emgwen", "Mosop", "Zandui", "Kipkellion East", "Kipkellion West", "Ainamoi", "Bureti", "Belgut", "Sigowet/Soin", "Sotik", "Chepalungu", "Bomet East", "Bomet Central", "Konoin", "Lugari", "Likuyani", "Malava", "Lurambi", "Navakholo", "Mumias West", "Mumias East", "Matungu", "Butere", "Khwisero", "Shinyalu", "Ikolomani", "Vihiga", "Sabatia", "Hamisi", "Luanda", "Emuhaya", "Mt. Elgon", "Sirisia", "Kabuchai", "Bumula", "Kanduyi", "Webuye East", "Webuye West", "Kimilili", "Tongaren", "Nakuru Town East", "Nakuru Town West", "Njoro", "Molo", "Menengai West", "Naivasha", "Gilgil", "Kuresoi South", "Kuresoi North", "Subukia", "Rongai", "Bahati", "Laikipia North", "Laikipia West", "Laikipia East", "Nyandarua North", "Nyandarua Central", "Nyandarua South", "Kinangop", "Kipipiri", "Ol Kalou", "Ol Jorok", "Nyahururu", "Mukurweini", "Baringo North", "Baringo Central", "Baringo South", "Mogotio", "Eldama Ravine", "Marigat", "Kajiado North", "Kajiado Central", "Kajiado East", "Kajiado West", "Kajiado South", "Narok North", "Narok East", "Narok South", "Narok West", "Kilgoris", "Emurua Dikirr"] },
      western: { name: "Western Region", districts: ["Lugari", "Likuyani", "Malava", "Lurambi", "Navakholo", "Mumias West", "Mumias East", "Matungu", "Butere", "Khwisero", "Shinyalu", "Ikolomani", "Vihiga", "Sabatia", "Hamisi", "Luanda", "Emuhaya", "Mt. Elgon", "Sirisia", "Kabuchai", "Bumula", "Kanduyi", "Webuye East", "Webuye West", "Kimilili", "Tongaren"] }
    }
  },
  uganda: {
    name: "Uganda",
    regions: {
      central: { name: "Central Region", districts: ["Kalangala", "Kampala", "Kayunga", "Kiboga", "Luwero", "Lyantonde", "Masaka", "Mpigi", "Mubende", "Mukono", "Nakaseke", "Nakasongola", "Rakai", "Sembabule", "Wakiso", "Bukomansimbi", "Butambala", "Gomba", "Kalungu", "Kyankwanzi", "Lwengo", "Mityana", "Ssembabule"] },
      eastern: { name: "Eastern Region", districts: ["Bugiri", "Busia", "Iganga", "Jinja", "Kamuli", "Kapchorwa", "Katakwi", "Kumi", "Mbale", "Pallisa", "Soroti", "Tororo", "Budaka", "Bududa", "Bukedea", "Bukwo", "Butaleja", "Kaliro", "Manafwa", "Namayingo", "Namutumba", "Sironko", "Bulambuli", "Buyende", "Kibuku", "Kween", "Luuka", "Ngora", "Serere", "Amuria", "Kaberamaido", "Dokolo", "Amolatar", "Oyam", "Kole", "Alebtong", "Otuke", "Agago", "Abim", "Kaabong", "Kotido", "Moroto", "Nakapiripirit", "Napak", "Amudat"] },
      northern: { name: "Northern Region", districts: ["Adjumani", "Apac", "Arua", "Gulu", "Kitgum", "Kotido", "Lira", "Moroto", "Moyo", "Nakapiripirit", "Nebbi", "Pader", "Yumbe", "Amolatar", "Amuria", "Dokolo", "Kaabong", "Koboko", "Abim", "Amudat", "Napak", "Zombo", "Lamwo", "Agago", "Alebtong", "Kole", "Nwoya", "Omoro", "Otuke", "Oyam", "Maracha", "Pakwach"] },
      western: { name: "Western Region", districts: ["Bundibugyo", "Bushenyi", "Hoima", "Kabale", "Kabarole", "Kasese", "Kibaale", "Kisoro", "Masindi", "Mbarara", "Ntungamo", "Rukungiri", "Kamwenge", "Kanungu", "Kyenjojo", "Rubirizi", "Ibanda", "Isingiro", "Kiruhura", "Sheema", "Buhweju", "Mitooma", "Buliisa", "Kyegegwa", "Rukiga"] }
    }
  },
  tanzania: {
    name: "Tanzania",
    regions: {
      arusha: { name: "Arusha Region", districts: ["Arusha City", "Arusha Rural", "Karatu", "Longido", "Monduli", "Ngorongoro"] },
      dar_es_salaam: { name: "Dar es Salaam Region", districts: ["Ilala", "Kinondoni", "Temeke", "Ubungo", "Kigamboni"] },
      dodoma: { name: "Dodoma Region", districts: ["Dodoma Urban", "Dodoma Rural", "Kondoa", "Mpwapwa", "Kongwa", "Chemba", "Bahi"] },
      geita: { name: "Geita Region", districts: ["Geita", "Bukombe", "Chato", "Mbogwe", "Nyang'hwale"] },
      iringa: { name: "Iringa Region", districts: ["Iringa Urban", "Iringa Rural", "Kilolo", "Mufindi"] },
      kagera: { name: "Kagera Region", districts: ["Bukoba Urban", "Bukoba Rural", "Muleba", "Ngara", "Biharamulo", "Karagwe", "Kyerwa", "Missenyi"] },
      katavi: { name: "Katavi Region", districts: ["Mpanda", "Nsimbo"] },
      kigoma: { name: "Kigoma Region", districts: ["Kigoma Urban", "Kigoma Rural", "Kasulu", "Kibondo", "Kakonko", "Uvinza"] },
      kilimanjaro: { name: "Kilimanjaro Region", districts: ["Moshi Urban", "Moshi Rural", "Hai", "Rombo", "Same", "Siha"] },
      lindi: { name: "Lindi Region", districts: ["Lindi Urban", "Lindi Rural", "Liwale", "Nachingwea", "Ruangwa"] },
      manyara: { name: "Manyara Region", districts: ["Babati", "Hanang", "Kiteto", "Mbulu", "Simanjiro"] },
      mara: { name: "Mara Region", districts: ["Musoma Urban", "Musoma Rural", "Bunda", "Butiama", "Serengeti", "Tarime", "Rorya"] },
      mbeya: { name: "Mbeya Region", districts: ["Mbeya Urban", "Mbeya Rural", "Chunya", "Kyela", "Mbarali", "Mbozi"] },
      morogoro: { name: "Morogoro Region", districts: ["Morogoro Urban", "Morogoro Rural", "Kilombero", "Kilosa", "Mvomero", "Ulanga", "Malinyi", "Gairo", "Ifakara"] },
      mtwara: { name: "Mtwara Region", districts: ["Mtwara Urban", "Mtwara Rural", "Masasi", "Nanyumbu", "Newala", "Tandahimba"] },
      mwanza: { name: "Mwanza Region", districts: ["Mwanza City", "Ilemela", "Nyamagana", "Sengerema", "Kwimba", "Misungwi", "Ukerewe", "Buchosa"] },
      njombe: { name: "Njombe Region", districts: ["Njombe Urban", "Njombe Rural", "Wanging'ombe", "Makambako"] },
      pwani: { name: "Pwani Region", districts: ["Bagamoyo", "Kibaha", "Kisarawe", "Mafia", "Mkuranga", "Rufiji"] },
      rukwa: { name: "Rukwa Region", districts: ["Sumbawanga Urban", "Sumbawanga Rural", "Nkasi"] },
      ruvuma: { name: "Ruvuma Region", districts: ["Songea Urban", "Songea Rural", "Mbinga", "Namtumbo", "Tunduru", "Nyasa"] },
      shinyanga: { name: "Shinyanga Region", districts: ["Shinyanga Urban", "Shinyanga Rural", "Kahama", "Kishapu", "Maswa", "Meatu", "Bariadi"] },
      simiyu: { name: "Simiyu Region", districts: ["Bariadi", "Busega", "Itilima", "Maswa", "Meatu"] },
      singida: { name: "Singida Region", districts: ["Singida Urban", "Singida Rural", "Ikungi", "Manyoni", "Mkalama"] },
      tabora: { name: "Tabora Region", districts: ["Tabora Urban", "Tabora Rural", "Igunga", "Nzega", "Urambo", "Uyui", "Kaliua", "Sikonge"] },
      tanga: { name: "Tanga Region", districts: ["Tanga City", "Tanga Rural", "Handeni", "Kilifi", "Korogwe", "Lushoto", "Muheza", "Pangani", "Mkinga"] }
    }
  }
};

export const Onboarding = () => {
  const navigate = useNavigate();
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [dominantCrops, setDominantCrops] = useState("");
  const [farmSizeCategory, setFarmSizeCategory] = useState("");

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setRegion(""); // Reset region when country changes
    setDistrict(""); // Reset district when country changes
  };

  const handleRegionChange = (value: string) => {
    setRegion(value);
    setDistrict(""); // Reset district when region changes
  };

  const getRegionsForCountry = () => {
    if (!country || !countryData[country as keyof typeof countryData]) return [];
    return Object.entries(countryData[country as keyof typeof countryData].regions).map(([key, value]) => ({
      key,
      name: value.name
    }));
  };

  const getDistrictsForRegion = () => {
    if (!country || !region || !countryData[country as keyof typeof countryData]) return [];
    const countryRegions = countryData[country as keyof typeof countryData].regions;
    const selectedRegion = countryRegions[region as keyof typeof countryRegions] as { name: string; districts: string[] } | undefined;
    return selectedRegion ? selectedRegion.districts : [];
  };

  const handleSignup = () => {
    // Mock onboarding completion
    navigate("/congratulations");
  };

  return (
    <Layout showNavBar={false}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/signup")}
              className="text-foreground hover:bg-muted p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-primary">FORM DETAILS</h1>
          </div>
        </div>

        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary">
                HOW DO YOU WANT TO RECEIVE CLIMATE-SMART INSIGHTS?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Select onValueChange={handleCountryChange} value={country}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="SELECT COUNTRY" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nigeria">Nigeria</SelectItem>
                    <SelectItem value="rwanda">Rwanda</SelectItem>
                    <SelectItem value="kenya">Kenya</SelectItem>
                    <SelectItem value="uganda">Uganda</SelectItem>
                    <SelectItem value="tanzania">Tanzania</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select onValueChange={handleRegionChange} value={region} disabled={!country}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="SELECT REGION" />
                  </SelectTrigger>
                  <SelectContent>
                    {getRegionsForCountry().map((regionItem) => (
                      <SelectItem key={regionItem.key} value={regionItem.key}>
                        {regionItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select onValueChange={setDistrict} value={district} disabled={!region}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="SELECT DISTRICT" />
                  </SelectTrigger>
                  <SelectContent>
                    {getDistrictsForRegion().map((districtName) => (
                      <SelectItem key={districtName} value={districtName}>
                        {districtName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Farm Size */}
              <div className="space-y-2">
                <Select value={farmSize} onValueChange={setFarmSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="FARM SIZE (HECTARES)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-1">Less than 1 hectare</SelectItem>
                    <SelectItem value="1-2">1-2 hectares</SelectItem>
                    <SelectItem value="2-5">2-5 hectares</SelectItem>
                    <SelectItem value="5-10">5-10 hectares</SelectItem>
                    <SelectItem value="10-20">10-20 hectares</SelectItem>
                    <SelectItem value="20-50">20-50 hectares</SelectItem>
                    <SelectItem value="50-100">50-100 hectares</SelectItem>
                    <SelectItem value="more-than-100">More than 100 hectares</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dominant Crops */}
              <div className="space-y-2">
                <Select value={dominantCrops} onValueChange={setDominantCrops}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="DOMINANT CROPS" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maize">Maize/Corn</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="cassava">Cassava</SelectItem>
                    <SelectItem value="yam">Yam</SelectItem>
                    <SelectItem value="plantain">Plantain</SelectItem>
                    <SelectItem value="cocoa">Cocoa</SelectItem>
                    <SelectItem value="coffee">Coffee</SelectItem>
                    <SelectItem value="tea">Tea</SelectItem>
                    <SelectItem value="beans">Beans/Legumes</SelectItem>
                    <SelectItem value="groundnuts">Groundnuts/Peanuts</SelectItem>
                    <SelectItem value="millet">Millet</SelectItem>
                    <SelectItem value="sorghum">Sorghum</SelectItem>
                    <SelectItem value="sweet-potato">Sweet Potato</SelectItem>
                    <SelectItem value="irish-potato">Irish Potato</SelectItem>
                    <SelectItem value="tomato">Tomato</SelectItem>
                    <SelectItem value="pepper">Pepper</SelectItem>
                    <SelectItem value="onion">Onion</SelectItem>
                    <SelectItem value="okra">Okra</SelectItem>
                    <SelectItem value="cucumber">Cucumber</SelectItem>
                    <SelectItem value="watermelon">Watermelon</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="citrus">Citrus Fruits</SelectItem>
                    <SelectItem value="avocado">Avocado</SelectItem>
                    <SelectItem value="mango">Mango</SelectItem>
                    <SelectItem value="papaya">Papaya</SelectItem>
                    <SelectItem value="sugarcane">Sugarcane</SelectItem>
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="tobacco">Tobacco</SelectItem>
                    <SelectItem value="sesame">Sesame</SelectItem>
                    <SelectItem value="sunflower">Sunflower</SelectItem>
                    <SelectItem value="palm-oil">Oil Palm</SelectItem>
                    <SelectItem value="rubber">Rubber</SelectItem>
                    <SelectItem value="mixed-vegetables">Mixed Vegetables</SelectItem>
                    <SelectItem value="mixed-cereals">Mixed Cereals</SelectItem>
                    <SelectItem value="livestock-feed">Livestock Feed Crops</SelectItem>
                    <SelectItem value="medicinal-plants">Medicinal Plants</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Farm Size Category */}
              <div className="space-y-2">
                <Select value={farmSizeCategory} onValueChange={setFarmSizeCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="FARM CATEGORY" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smallholder">Smallholder Farm</SelectItem>
                    <SelectItem value="medium">Medium-scale Farm</SelectItem>
                    <SelectItem value="commercial">Commercial Farm</SelectItem>
                    <SelectItem value="subsistence">Subsistence Farm</SelectItem>
                    <SelectItem value="cooperative">Cooperative Farm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSignup}
                className="w-full bg-success hover:bg-success/90 text-white font-bold py-3 rounded-xl mt-8"
                size="lg"
              >
                SIGN UP
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};