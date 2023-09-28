<script>
export default {
    name: 'AccountDetailsLayout'
}
</script>

<script setup>
import {
    FigLabelValueGroup,
    FigLabelValue,
    FigSpecLayout,
    FigSpec
} from '@notoursllc/figleaf';
</script>


<template>
    <fig-spec-layout v-bind="$props">
        <!-- Application -->
        <fig-spec>
            <template v-slot:label>
                {{ $t('Application')}}
            </template>

            <fig-label-value-group density="lg" display="table" bold-labels class="text-sm">
                <fig-label-value>
                    <template v-slot:label>{{ $t('Application name') }}:</template>
                    <slot name="application_name" />
                </fig-label-value>

                <fig-label-value>
                    <template v-slot:label>{{ $t('Application URL') }}:</template>
                    <slot name="application_url" />
                </fig-label-value>

                <fig-label-value>
                    <template v-slot:label>{{ $t('Application logo') }}:</template>
                    <slot name="application_logo" />
                </fig-label-value>

                <fig-label-value>
                    <template v-slot:label>{{ $t('URL to order details page') }}:</template>
                    <slot name="order_details_page_url" />
                </fig-label-value>

                <!-- <fig-label-value>
                    <template v-slot:label>{{ $t('API key') }}:</template>
                    <slot name="api_key" />
                </fig-label-value> -->
            </fig-label-value-group>
        </fig-spec>

        <!-- Payments -->
        <fig-spec>
            <template v-slot:label>
                {{ $t('Payments')}}
            </template>

            <fig-label-value-group density="lg" display="table" bold-labels class="text-sm">
                <fig-label-value>
                    <template v-slot:label>{{ $t('Stripe API key') }}:</template>
                    <slot name="stripe_api_key" />
                </fig-label-value>
            </fig-label-value-group>
        </fig-spec>

        <!-- Shipping -->
        <fig-spec>
            <template v-slot:label>
                {{ $t('Shipping')}}
            </template>

            <fig-label-value-group density="lg" display="table" bold-labels class="text-sm">
                <fig-label-value>
                    <template v-slot:label>{{ $t('ShipEngine API key') }}:</template>
                    <slot name="shipengine_api_key" />
                </fig-label-value>

                <fig-label-value>
                    <template v-slot:label>{{ $t('ShipEngine carriers') }}:</template>
                    <slot name="shipengine_carriers" />
                </fig-label-value>

                <fig-label-value>
                    <template v-slot:label>{{ $t('Shipping from address: company') }}:</template>
                    <slot name="shipping_from_company" />
                </fig-label-value>

                <fig-label-value>
                    <template v-slot:label>{{ $t('Shipping from address: country') }}:</template>
                    <slot name="shipping_from_countryCodeAlpha2" />
                </fig-label-value>

                <fig-label-value>
                    <template v-slot:label>{{ $t('Shipping from address: street address') }}:</template>
                    <slot name="shipping_from_streetAddress" />
                </fig-label-value>

                <fig-label-value>
                    <template v-slot:label>{{ $t('Shipping from address: city') }}:</template>
                    <slot name="shipping_from_city" />
                </fig-label-value>

                <fig-label-value>
                    <template v-slot:label>{{ $t('Shipping from address: state') }}:</template>
                    <slot name="shipping_from_state" />
                </fig-label-value>

                <fig-label-value>
                    <template v-slot:label>{{ $t('Shipping from address: postal code') }}:</template>
                    <slot name="shipping_from_postalCode" />
                </fig-label-value>

                <fig-label-value>
                    <template v-slot:label>{{ $t('Shipping from address: phone') }}:</template>
                    <slot name="shipping_from_phone" />
                </fig-label-value>
            </fig-label-value-group>
        </fig-spec>

        <fig-spec>
            <slot name="button" />
        </fig-spec>
    </fig-spec-layout>
</template>
