-- 003_trigger_provision_user.sql — M4 Rights & Auth
-- Auto-provisions new auth users as USER / INACTIVE with default rights

CREATE OR REPLACE FUNCTION public.provision_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_username TEXT;
BEGIN
  v_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email,'@',1));
  INSERT INTO public."user" (userId,username,firstName,lastName,email,user_type,record_status,stamp)
  VALUES (NEW.id::text, v_username, COALESCE(NEW.raw_user_meta_data->>'first_name',''), COALESCE(NEW.raw_user_meta_data->>'last_name',''), NEW.email,'USER','INACTIVE','AUTO-PROVISIONED '||NOW()::text)
  ON CONFLICT (userId) DO NOTHING;

  INSERT INTO public.user_module (userId,moduleCode,rights_value) VALUES
    (NEW.id::text,'Sales_Mod',1),(NEW.id::text,'SD_Mod',1),(NEW.id::text,'Lookup_Mod',1),(NEW.id::text,'Adm_Mod',0)
  ON CONFLICT DO NOTHING;

  INSERT INTO public."UserModule_Rights" (userId,rightCode,right_value) VALUES
    (NEW.id::text,'SALES_VIEW',1),(NEW.id::text,'SALES_ADD',0),(NEW.id::text,'SALES_EDIT',0),(NEW.id::text,'SALES_DEL',0),
    (NEW.id::text,'SD_VIEW',1),(NEW.id::text,'SD_ADD',0),(NEW.id::text,'SD_EDIT',0),(NEW.id::text,'SD_DEL',0),
    (NEW.id::text,'CUST_LOOKUP',1),(NEW.id::text,'EMP_LOOKUP',1),(NEW.id::text,'PROD_LOOKUP',1),(NEW.id::text,'PRICE_LOOKUP',1),
    (NEW.id::text,'ADM_USER',0)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.provision_new_user();
