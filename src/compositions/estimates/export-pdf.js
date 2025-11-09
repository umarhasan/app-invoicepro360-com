
import { reactive, toRefs } from "vue"
import { useApi } from "@/compositions/api"
import config from "@/config"
import { helper as $h } from "@/utils/helper"

const state = reactive({
    title : 'Export to PDF',
    showLoadingIcon :false,
    status : null,
    error   : null,
    permissions:[]
})

export const exportPDF = () => {

    const download = (uuid) => {

        let url = `${config.INVOICE_URL}invoice-pdf/${uuid}`

        const { data, get, error,status }  = useApi(url)
    
        // checkPermissions('invoice','export')
        
        state.showLoadingIcon = true

        get().then( () => {
            state.status = status.value
            
            if(status.value === 404 || status.value === 400){
                state.error = error.value
                $h.notification(true,"Unable to download invoice PDF",[])

            }else{
    
                let base64String = `data:application/pdf;base64, ${data.value.data}`;

                const downloadLink = document.createElement("a");
                const fileName = `invoice-${uuid}.pdf`;
                downloadLink.href = base64String;
                downloadLink.download = fileName;
                downloadLink.click();
                state.showLoadingIcon = false
                $h.notification(false,"Invoice PDF downloaded",[])
            }        
        })
    }

    return {
        ...toRefs(state),
        download,
    }
}