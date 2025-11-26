import { Injectable } from "@nestjs/common";

@Injectable()
export class DateUtil {
  async getMonthlyDates(startDate: Date, endDate: Date, targetDay: number) {
    // Funksiyaga kelgan sanalar endi to'g'ridan-to'g'ri ishlatiladi.
    const start = startDate;
    const end = endDate;
    const result: string[] = [];

    // 1. Biz "ushlab turmoqchi" bo'lgan asosiy kun (masalan, 31)
    // const targetDay = start.getDate();

    let currentYear = start.getFullYear();
    let currentMonth = start.getMonth(); // Oylar 0 (Yanvar) dan boshlanadi

    while (true) {
      // 2. Joriy oyda necha kun borligini aniqlaymiz:
      // (month + 1, 0) - bu keyingi oyning 0-kunini, ya'ni joriy oyning oxirgi kunini beradi.
      const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      // 3. Qaysi kunni olishni hal qilamiz (31 yoki oyning oxirgi kuni)
      const actualDay = Math.min(targetDay, daysInCurrentMonth);

      // 4. Sanani yaratamiz
      const dateEntry = new Date(currentYear, currentMonth, actualDay);

      // 5. Agar sana tugash sanasidan o'tib ketsa, siklni to'xtatamiz
      if (dateEntry > end) break;

      // 6. Agar sana boshlanish sanasidan katta yoki teng bo'lsa, arrayga qo'shamiz
      if (dateEntry >= start) {
        // Natijani DD-MM-YYYY formatiga keltiramiz
        const d = String(dateEntry.getDate()).padStart(2, '0');
        const m = String(dateEntry.getMonth() + 1).padStart(2, '0');
        const y = dateEntry.getFullYear();
        result.push(`${d}-${m}-${y}`);
      }

      // 7. Keyingi oyga o'tamiz
      currentMonth++;
      // Yilni oshirish kerak bo'lsa, uni boshqaramiz
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }

    return result;
  }

  getFirstDateOfMonth(date: Date): Date {
    // 1. Kirish sanasidan yilni olamiz.
    const year = date.getFullYear();
    
    // 2. Kirish sanasidan oyni olamiz (JavaScriptda oylar 0 dan boshlanadi).
    const month = date.getMonth(); 
    
    // 3. Yangi Date obyektini yaratamiz, kunni doimo 1 ga tenglaymiz.
    // Bu yangi obyekt oyning 1-kunini ifodalaydi.
    return new Date(year, month, 1);
  }

  getNextDate (startDate: Date, target: number, type: 'day' | 'month' | 'year') {
    // 1. Original sananing o'zgarishini oldini olish uchun nusxasini yaratamiz
    const newDate = new Date(startDate);

    // 2. Tanlangan turga qarab sanani o'zgartiramiz
    switch (type) {
      case 'day':
        // .setDate() avtomatik ravishda oy va yil almashishini boshqaradi
        newDate.setDate(newDate.getDate() + target);
        break;

      case 'month':
        // .setMonth() avtomatik ravishda yil almashishini boshqaradi
        newDate.setMonth(newDate.getMonth() + target);
        break;

      case 'year':
        // .setFullYear() to'g'ridan-to'g'ri yilni o'zgartiradi
        newDate.setFullYear(newDate.getFullYear() + target);
        break;
    }
    
    return newDate;
  }

  stringToDate(dateString: string): Date {
    // Matnni '-' ajratuvchisi bo'yicha bo'lamiz
    const parts = dateString.split('-');

    // Qismlarni butun songa aylantiramiz
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Date obyektini yaratish
    // OY indeksi (month) 0 dan boshlanganligi sababli (fevral = 1) 1 ni ayiramiz.
    // Yangi sana: Yil, Oy indeksi, Kun (Mahalliy vaqtda 00:00:00)
    const dateObject = new Date(Date.UTC(year, month - 1, day));

    return dateObject;
  }
}