import { Injectable } from "@nestjs/common";

@Injectable()
export class DateUtil {
  async getMonthlyDates(startDate: Date, endDate: Date, targetDay: number) {
    const result: string[] = [];
    
    // 1. Kirish sanalarini UTC formatida soatlarini nolga tushirib olamiz
    const start = new Date(startDate);
    const end = new Date(endDate);

    let currentYear = start.getUTCFullYear();
    let currentMonth = start.getUTCMonth();

    while (true) {
        // 2. Oyning oxirgi kunini UTC bo'yicha aniqlaymiz
        const lastDayOfCurrentMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0)).getUTCDate();
        
        const actualDay = Math.min(targetDay, lastDayOfCurrentMonth);
        
        // 3. Sanani UTC bo'yicha yaratamiz (bu eng muhimi!)
        const dateEntry = new Date(Date.UTC(currentYear, currentMonth, actualDay));

        // 4. Taqqoslash (millisekundlarda yoki Date obyekti bilan)
        if (dateEntry > end) break;

        if (dateEntry >= start) {
            const d = String(dateEntry.getUTCDate()).padStart(2, '0');
            const m = String(dateEntry.getUTCMonth() + 1).padStart(2, '0');
            const y = dateEntry.getUTCFullYear();
            result.push(`${d}-${m}-${y}`);
        }

        // 5. Keyingi oyga o'tish
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        
        if (currentYear > end.getUTCFullYear() + 1) break;
    }

    return result;
  }

  getFirstDateOfMonth(date: Date): Date {
    // Sanani UTC bo'yicha yaratish (Vaqt mintaqasi ta'sir qilmasligi uchun)
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
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

  getFirstPaymentDate(date: Date, target: number): Date {
    // 1. Sanani olish uchun getDate() ishlatamiz (getDay emas!)
    let currentDay = date.getDate(); 
    let currentMonth = date.getMonth(); 
    let currentYear = date.getFullYear();

    // 2. Yangi sana obyektini joriy yil va oyda, lekin belgilangan kunda yaratamiz
    let paymentDate = new Date(currentYear, currentMonth, target);

    // 3. Agar bu kun startDate dan kichik bo'lsa, demak keyingi oyga o'tamiz
    // JS setMonth(currentMonth + 1) qilsangiz, yil o'zgarishini o'zi eplaydi
    if (paymentDate <= date) {
        paymentDate.setMonth(currentMonth + 1);
    }

    // Natijani formatlab qaytaramiz
    const d = String(paymentDate.getDate()).padStart(2, '0');
    const m = String(paymentDate.getMonth() + 1).padStart(2, '0');
    const y = paymentDate.getFullYear();
    
    return new Date(`${y}-${m}-${d}`);
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