# CPU Scheduling Visualizer

Ovaj projekat predstavlja web aplikaciju dizajniranu za vizuelizaciju i demonstraciju različitih algoritama za raspoređivanje procesa (CPU Scheduling) koji se koriste u operativnim sistemima. Namenjen je studentima, profesorima i svima koji žele bolje da razumeju kako operativni sistem upravlja izvršavanjem procesa.

## 📂 Struktura projekta

Repozitorijum sadrži sledeće fajlove:

* **`index.html`** – Glavni HTML dokument koji čini korisnički interfejs aplikacije.
* **`style.css`** – Stilovi i dizajn stranice (izgled, raspored elemenata i animacije).
* **`script.js`** – Logika aplikacije, implementacija algoritama za raspoređivanje i interaktivnost.

## ⚙️ Podržani algoritmi

Aplikacija omogućava testiranje i prikaz rada klasičnih algoritama za raspoređivanje procesa:

* **FCFS** (First-Come, First-Served) – Prvi došao, prvi uslužen
* **SJF** (Shortest Job First) – Najkraći posao prvi (u neprekidnim i preemptivnim varijantama)
* **Round Robin** (RR) – Kružno raspoređivanje sa vremenskim kvantom
* **Priority Scheduling** – Prioritetno raspoređivanje

## 🚀 Kako pokrenuti projekat

Pošto je projekat izgrađen korišćenjem standardnih web tehnologija (HTML, CSS i JavaScript), nije potrebna nikakva posebna instalacija ni podešavanje okruženja.

1. Klonirajte repozitorijum ili preuzmite fajlove:
```bash
git clone https://github.com/vase_korisnicko_ime/cpu-scheduling.git

```


2. Otvorite fajl **`index.html`** u bilo kom modernom web pretraživaču (Chrome, Firefox, Edge, Safari).

## 🛠️ Korišćenje aplikacije

1. Unesite parametre procesa (ID procesa, vreme dolaska - Arrival Time, vreme izvršavanja - Burst Time, i opcionalno prioritet).
2. Izaberite željeni algoritam za raspoređivanje.
3. Pokrenite simulaciju da biste videli redosled izvršavanja, Gantt-ov dijagram i izračunate metrike (vreme čekanja, vreme odziva, itd.).
