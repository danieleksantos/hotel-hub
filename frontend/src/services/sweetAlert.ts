import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const commonClasses = {
  popup: 'rounded-2xl shadow-2xl border border-gray-100 p-8',
  title: 'text-xl font-bold text-gray-800 uppercase tracking-widest mb-2',
  htmlContainer: 'text-gray-500 font-medium text-sm leading-relaxed',
  actions: 'flex gap-3 mt-8 w-full justify-center px-4',

  buttonBase: `
    flex-1 flex items-center justify-center gap-2
    py-3 px-6 rounded-lg shadow-md
    text-[11px] font-bold uppercase tracking-widest
    transition-all duration-200
    cursor-pointer outline-none active:scale-95
    hover:shadow-xl hover:-translate-y-0.5
  `,
}

export const alertService = {
  destructive: async (title: string, html: string) => {
    return MySwal.fire({
      title: title,
      html: html,
      icon: 'warning',
      iconColor: '#ef4444',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: commonClasses.popup,
        title: commonClasses.title,
        htmlContainer: commonClasses.htmlContainer,
        actions: commonClasses.actions,
        confirmButton: `${commonClasses.buttonBase} bg-[#ef4444] text-white`,
        cancelButton: `${commonClasses.buttonBase} bg-[#469170] text-white`,
      },
    })
  },

  confirm: async (title: string, html: string) => {
    return MySwal.fire({
      title: title,
      html: html,
      icon: 'question',
      iconColor: 'var(--color-primary)',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Voltar',
      reverseButtons: true,
      customClass: {
        popup: commonClasses.popup,
        title: commonClasses.title,
        htmlContainer: commonClasses.htmlContainer,
        actions: commonClasses.actions,
        confirmButton: `${commonClasses.buttonBase} bg-primary text-white hover:bg-secondary hover:text-primary`,
        cancelButton: `${commonClasses.buttonBase} bg-gray-100 text-gray-500 hover:bg-gray-200`,
      },
    })
  },
}
