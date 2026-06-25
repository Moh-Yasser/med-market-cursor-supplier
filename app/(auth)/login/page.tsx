import { LoginForm } from "@/components/login-form";
import { CheckCircle2, Package, Tag } from "lucide-react";

export default function Page() {
  return (
    <main className="flex min-h-screen w-full flex-col lg:flex-row">
      <section className="relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex lg:w-1/2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15">
            <Package className="size-5" aria-hidden="true" />
          </div>
          <span className="font-heading text-lg font-semibold">
            منصة الإمداد الدوائي
          </span>
        </div>

        <div className="max-w-md">
          <h2 className="font-heading text-4xl font-bold leading-tight tracking-tight text-balance">
            منصة واحدة تربط الموردين بالصيدليات.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-primary-foreground/80 text-pretty">
            نمِّ أعمالك مع شبكة موثوقة من الموردين والصيدليات. إدارة أسرع، عروض
            أفضل، وطلبات أكثر كفاءة لتحقيق نمو مستدام.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {[
              { icon: Package, text: "أضف منتجاتك وأدر قائمتك بسهولة" },
              { icon: Tag, text: "أنشئ العروض والخصومات بالجملة" },
              { icon: CheckCircle2, text: "طلب سريع وموثوق للصيدليات" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="text-primary-foreground/90">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-primary-foreground/60">
          {`© ${new Date().getFullYear()} منصة الإمداد الدوائي. جميع الحقوق محفوظة.`}
        </p>
      </section>

      {/* Form panel */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8">
        {/* Mobile brand header */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <Package
              className="size-5 text-primary-foreground"
              aria-hidden="true"
            />
          </div>
          <span className="font-heading text-lg font-semibold text-foreground">
            منصة الإمداد الدوائي
          </span>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
