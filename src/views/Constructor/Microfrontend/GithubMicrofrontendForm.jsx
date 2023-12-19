import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {
  useGithubBranchesQuery,
  useGithubLoginMutation,
  useGithubRepositoriesQuery,
  useGithubUserQuery
} from "@/services/githubService";
import {useEffect, useState} from "react";
import RingLoaderWithWrapper from "@/components/Loaders/RingLoader/RingLoaderWithWrapper";
import HeaderSettings from "@/components/HeaderSettings";
import FormCard from "@/components/FormCard";
import HFSelect from "@/components/FormElements/HFSelect";
import FRow from "@/components/FormElements/FRow";
import HFTextField from "@/components/FormElements/HFTextField";
import {useForm, useWatch} from "react-hook-form";
import listToOptions from "@/utils/listToOptions";
import Footer from "@/components/Footer";
import SecondaryButton from "@/components/Buttons/SecondaryButton";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import {Save} from "@mui/icons-material";


const GithubMicrofrontendForm = () => {
  const {appId} = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const microfrontendListPageLink = `/main/${appId}/microfrontend`

  const { control, handleSubmit } = useForm()

  const selectedRepo = useWatch({
    control,
    name: 'repo'
  })

  const { mutate: login, isLoading } = useGithubLoginMutation({
    onSuccess: res => {
      setSearchParams({access_token: res.access_token})
    },
    onError: () => {
      navigate(microfrontendListPageLink)
    }
  })


  const { data: ownerUsername } = useGithubUserQuery({
    token: searchParams.get('access_token'),
    enabled: !!searchParams.get('access_token'),
    queryParams: {
      select: res => res?.data?.login
    }
  })

  const { data: repositories } = useGithubRepositoriesQuery({
    username: ownerUsername,
    queryParams: {
      enabled: !!ownerUsername,
      select: res => listToOptions(res?.data, 'name', 'name')
    }
  })


  const { data: branches } = useGithubBranchesQuery({
    username: ownerUsername,
    repo: selectedRepo,
    token: searchParams.get('access_token'),
    queryParams: {
      enabled: !!ownerUsername && !!selectedRepo,
      select: res => listToOptions(res?.data, 'name', 'name')
    }
  })

  const onSubmit = (values) => {

  }

  useEffect(() => {
    const code = searchParams.get('code')
    if(code) {
      login({ code })
    }
  }, [])

  if(isLoading) return <RingLoaderWithWrapper style={{ height: "100vh" }} />

  return <div>
    <HeaderSettings
      title="Микрофронтенд (GitHub)"
      backButtonLink={microfrontendListPageLink}
    ></HeaderSettings>

    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-2"
      style={{height: "calc(100vh - 112px)", overflow: "auto"}}
    >
      <FormCard title="Детали" maxWidth={500}>
        <FRow
          label={"Названия"}
          required
        >
          <HFTextField
            disabledHelperText
            name="name"
            control={control}
            fullWidth
            required
          />
        </FRow>

        <FRow label="Репозиторий" required >
          <HFSelect
            name="repo"
            control={control}
            options={repositories ?? []}
            required
          />
        </FRow>

        <FRow label="Ветка" required >
          <HFSelect
            name="branch"
            control={control}
            options={branches}
            required
          />
        </FRow>
      </FormCard>
    </form>


    <Footer
      extra={
        <>
          <SecondaryButton
            onClick={() => navigate(microfrontendListPageLink)}
            color="error"
          >
            Close
          </SecondaryButton>
            <PrimaryButton
              // loader={btnLoader}
              // onClick={mainForm.handleSubmit(onSubmit)}
            >
              <Save /> Save
            </PrimaryButton>
        </>
      }
    />

  </div>
}

export default GithubMicrofrontendForm